"use client";

import { useState } from "react";

interface AddToPortfolioButtonProps {
  selectedImageIds: string[];
  onSuccess?: () => void;
}

export function AddToPortfolioButton({
  selectedImageIds,
  onSuccess,
}: AddToPortfolioButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Use tRPC mutation
  // const addToPortfolio = trpc.portfolio.addImage.useMutation();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (selectedImageIds.length === 0) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement batch add to portfolio
      // for (const imageId of selectedImageIds) {
      //   await addToPortfolio.mutateAsync({
      //     imageId,
      //     category: category || undefined,
      //     tags: tags.length > 0 ? tags : undefined,
      //   });
      // }

      setIsOpen(false);
      setCategory("");
      setTags([]);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to add to portfolio:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedImageIds.length === 0) {
    return null;
  }

  return (
    <>
      <button
        className="rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Add to Portfolio ({selectedImageIds.length})
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="font-semibold text-xl">Add to Portfolio</h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-6">
              <div>
                <p className="mb-4 text-gray-600 text-sm">
                  Adding {selectedImageIds.length} image
                  {selectedImageIds.length > 1 ? "s" : ""} to your portfolio
                </p>

                {/* Category */}
                <div>
                  <label
                    className="mb-1 block font-medium text-gray-700 text-sm"
                    htmlFor="category"
                  >
                    Category (optional)
                  </label>
                  <input
                    className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="category"
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Weddings, Portraits, Landscape"
                    type="text"
                    value={category}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label
                    className="mb-1 block font-medium text-gray-700 text-sm"
                    htmlFor="tags"
                  >
                    Tags (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="tags"
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add a tag..."
                      type="text"
                      value={tagInput}
                    />
                    <button
                      className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                      onClick={handleAddTag}
                      type="button"
                    >
                      Add
                    </button>
                  </div>

                  {/* Tag List */}
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-blue-800 text-sm"
                          key={tag}
                        >
                          {tag}
                          <button
                            className="hover:text-blue-900"
                            onClick={() => handleRemoveTag(tag)}
                            type="button"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t p-6">
              <button
                className="rounded border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
                disabled={isSubmitting}
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                disabled={isSubmitting}
                onClick={handleSubmit}
                type="button"
              >
                {isSubmitting ? "Adding..." : "Add to Portfolio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
