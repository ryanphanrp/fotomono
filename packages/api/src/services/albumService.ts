import { db } from "@fotomono/db";
import {
  clientAlbum,
  clientAlbumImage,
  image,
  show,
} from "@fotomono/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Album Service
 * Handles client album CRUD operations and image management
 */
export class AlbumService {
  /**
   * Create a new album from a show
   */
  async createAlbum(
    userId: string,
    data: {
      showId: string;
      name: string;
      description?: string;
      imageIds?: string[];
    }
  ) {
    // Verify show belongs to user
    const showExists = await db
      .select()
      .from(show)
      .where(and(eq(show.id, data.showId), eq(show.userId, userId)))
      .limit(1);

    if (!showExists || showExists.length === 0) {
      throw new Error("Show not found or unauthorized");
    }

    // Create album
    const album = await db
      .insert(clientAlbum)
      .values({
        id: nanoid(),
        userId,
        showId: data.showId,
        name: data.name,
        description: data.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Add images if provided
    if (data.imageIds && data.imageIds.length > 0) {
      await this.addImages(userId, album[0].id, data.imageIds);
    }

    return album[0];
  }

  /**
   * List all albums for a user
   */
  async listAlbums(userId: string) {
    const albums = await db
      .select({
        id: clientAlbum.id,
        name: clientAlbum.name,
        description: clientAlbum.description,
        showId: clientAlbum.showId,
        showName: show.name,
        createdAt: clientAlbum.createdAt,
        updatedAt: clientAlbum.updatedAt,
      })
      .from(clientAlbum)
      .innerJoin(show, eq(clientAlbum.showId, show.id))
      .where(eq(clientAlbum.userId, userId))
      .orderBy(desc(clientAlbum.createdAt));

    // Get image count for each album
    const albumsWithCounts = await Promise.all(
      albums.map(async (album) => {
        const images = await db
          .select()
          .from(clientAlbumImage)
          .where(eq(clientAlbumImage.albumId, album.id));

        return {
          ...album,
          imageCount: images.length,
        };
      })
    );

    return albumsWithCounts;
  }

  /**
   * Get album by ID with images
   */
  async getAlbumById(userId: string, albumId: string) {
    // Get album
    const album = await db
      .select({
        id: clientAlbum.id,
        name: clientAlbum.name,
        description: clientAlbum.description,
        showId: clientAlbum.showId,
        showName: show.name,
        createdAt: clientAlbum.createdAt,
        updatedAt: clientAlbum.updatedAt,
      })
      .from(clientAlbum)
      .innerJoin(show, eq(clientAlbum.showId, show.id))
      .where(and(eq(clientAlbum.id, albumId), eq(clientAlbum.userId, userId)))
      .limit(1);

    if (!album || album.length === 0) {
      throw new Error("Album not found or unauthorized");
    }

    // Get images
    const images = await db
      .select({
        albumImageId: clientAlbumImage.id,
        position: clientAlbumImage.position,
        imageId: image.id,
        filename: image.filename,
        url: image.url,
        thumbnailSmallUrl: image.thumbnailSmallUrl,
        thumbnailMediumUrl: image.thumbnailMediumUrl,
        thumbnailLargeUrl: image.thumbnailLargeUrl,
        width: image.width,
        height: image.height,
      })
      .from(clientAlbumImage)
      .innerJoin(image, eq(clientAlbumImage.imageId, image.id))
      .where(eq(clientAlbumImage.albumId, albumId))
      .orderBy(clientAlbumImage.position);

    return {
      ...album[0],
      images,
    };
  }

  /**
   * Update album details
   */
  async updateAlbum(
    userId: string,
    albumId: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    // Verify ownership
    const album = await db
      .select()
      .from(clientAlbum)
      .where(and(eq(clientAlbum.id, albumId), eq(clientAlbum.userId, userId)))
      .limit(1);

    if (!album || album.length === 0) {
      throw new Error("Album not found or unauthorized");
    }

    // Update
    const updated = await db
      .update(clientAlbum)
      .set({
        name: data.name,
        description: data.description,
        updatedAt: new Date(),
      })
      .where(eq(clientAlbum.id, albumId))
      .returning();

    return updated[0];
  }

  /**
   * Delete album
   */
  async deleteAlbum(userId: string, albumId: string) {
    // Verify ownership
    const album = await db
      .select()
      .from(clientAlbum)
      .where(and(eq(clientAlbum.id, albumId), eq(clientAlbum.userId, userId)))
      .limit(1);

    if (!album || album.length === 0) {
      throw new Error("Album not found or unauthorized");
    }

    // Delete (cascade will handle album images and links)
    await db.delete(clientAlbum).where(eq(clientAlbum.id, albumId));

    return { success: true };
  }

  /**
   * Add images to album
   */
  async addImages(userId: string, albumId: string, imageIds: string[]) {
    // Verify album ownership
    const album = await db
      .select()
      .from(clientAlbum)
      .where(and(eq(clientAlbum.id, albumId), eq(clientAlbum.userId, userId)))
      .limit(1);

    if (!album || album.length === 0) {
      throw new Error("Album not found or unauthorized");
    }

    // Verify images belong to the album's show
    const images = await db
      .select()
      .from(image)
      .where(
        and(inArray(image.id, imageIds), eq(image.showId, album[0].showId))
      );

    if (images.length !== imageIds.length) {
      throw new Error("Some images not found or not in album's show");
    }

    // Get current max position
    const existing = await db
      .select()
      .from(clientAlbumImage)
      .where(eq(clientAlbumImage.albumId, albumId));

    let position = existing.length;

    // Add images
    const albumImages = await Promise.all(
      imageIds.map((imageId) =>
        db
          .insert(clientAlbumImage)
          .values({
            id: nanoid(),
            albumId,
            imageId,
            position: position++,
            createdAt: new Date(),
          })
          .returning()
      )
    );

    return albumImages.map((ai) => ai[0]);
  }

  /**
   * Remove images from album
   */
  async removeImages(userId: string, albumId: string, albumImageIds: string[]) {
    // Verify album ownership
    const album = await db
      .select()
      .from(clientAlbum)
      .where(and(eq(clientAlbum.id, albumId), eq(clientAlbum.userId, userId)))
      .limit(1);

    if (!album || album.length === 0) {
      throw new Error("Album not found or unauthorized");
    }

    // Delete album images
    await db
      .delete(clientAlbumImage)
      .where(
        and(
          eq(clientAlbumImage.albumId, albumId),
          inArray(clientAlbumImage.id, albumImageIds)
        )
      );

    return { success: true };
  }

  /**
   * Reorder images in album
   */
  async reorderImages(
    userId: string,
    albumId: string,
    imageOrders: Array<{ albumImageId: string; position: number }>
  ) {
    // Verify album ownership
    const album = await db
      .select()
      .from(clientAlbum)
      .where(and(eq(clientAlbum.id, albumId), eq(clientAlbum.userId, userId)))
      .limit(1);

    if (!album || album.length === 0) {
      throw new Error("Album not found or unauthorized");
    }

    // Update positions
    await Promise.all(
      imageOrders.map(({ albumImageId, position }) =>
        db
          .update(clientAlbumImage)
          .set({ position })
          .where(
            and(
              eq(clientAlbumImage.id, albumImageId),
              eq(clientAlbumImage.albumId, albumId)
            )
          )
      )
    );

    return { success: true };
  }
}

/**
 * Singleton instance
 */
export const albumService = new AlbumService();
