"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  AlertCircle,
  Camera,
  Heart,
  Send,
  Star,
  ThumbsDown,
  X,
} from "lucide-react"
import { toast } from "react-hot-toast";
import {
  createRecension,
  loadRecensionsByUtegymName,
} from "@/controllers/recension.controller"
import {
  getAverageRating,
  getTimeAgo,
  toggleRecensionLike,
} from "@/services/recension.service"
import type {
  FormErrors,
  NewRecensionInput,
  Recension,
  UserLike,
} from "@/types/recension"

interface RecensionSystemProps {
  userId?: string
  userName?: string | null
  utegymName?: string
}

/**
 * RecensionSystem - Main component managing all recension functionality
 * Includes creating new recensions and displaying existing ones
 */
export default function RecensionSystem({ userId, userName, utegymName }: RecensionSystemProps) {
  const isLoggedIn = Boolean(userId)
  const [recensions, setRecensions] = useState<Recension[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      const { recensions: loadedRecensions, errorType } =
        await loadRecensionsByUtegymName(utegymName)

      if (errorType) {
        toast.error("Could not load reviews.");
        setIsLoading(false);
        return;
      }

      setRecensions(loadedRecensions);
      setIsLoading(false);
    };

    void loadReviews();
  }, [utegymName]);

  const handleAddRecension = async (newRecension: NewRecensionInput) => {
    const { recension, errorType } = await createRecension({
      input: newRecension,
      userId,
      userName,
      utegymName,
    })

    if (errorType) {
      if (errorType === "NOT_LOGGED_IN") {
        toast.error("Please log in to write reviews.");
        return;
      }
      if (errorType === "MISSING_UTEGYM_NAME") {
        toast.error("Missing utegym name.");
        return;
      }
      if (errorType === "PHOTO_UPLOAD_FAILED") {
        toast.error("Could not upload review photo.");
        return;
      }
      toast.error("Could not save review.");
      return;
    }

    if (!recension) {
      toast.error("Could not save review.");
      return;
    }
    setRecensions((prev) => [recension, ...prev]);
    setShowForm(false);
    toast.success("Review posted.");
  };

  const handleToggleLike = (recensionId: number, action: Exclude<UserLike, null>) => {
    setRecensions((prev) =>
      toggleRecensionLike(prev, recensionId, action),
    )
  };

  const averageRating = getAverageRating(recensions)
  const averageRatingNumber = Number(averageRating);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header Stats */}
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 font-serif">Recensioner</h1>
          <div className="rounded-2xl border border-slate-400/20 bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-6 text-white backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl font-bold">{averageRating}</div>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.round(averageRatingNumber) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-300 mt-2">Based on {recensions.length} reviews</p>
              </div>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.error("Please log in to write reviews.");
                    return;
                  }
                  setShowForm(!showForm);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                + Write Review
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <RecensionForm onSubmit={handleAddRecension} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Recensions List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500">Loading reviews...</p>
            </div>
          ) : recensions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            recensions.map(recension => (
              <RecensionCard
                key={recension.id}
                recension={recension}
                onToggleLike={handleToggleLike}
                isOwnReview={recension.userId === userId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * RecensionForm - Component for creating a new recension
 */
interface RecensionFormProps {
  onSubmit: (input: NewRecensionInput) => void;
  onCancel: () => void;
}

function RecensionForm({ onSubmit, onCancel }: RecensionFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image must be less than 5MB' }));
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview((event.target?.result as string) ?? null);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!comment.trim()) newErrors.comment = 'Comment is required';
    if (comment.trim().length < 10) newErrors.comment = 'Comment must be at least 10 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      rating,
      title,
      comment,
      imageFile: image,
    });

    // Reset form
    setRating(5);
    setTitle('');
    setComment('');
    setImage(null);
    setImagePreview(null);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-900 font-serif">Share Your Experience</h2>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Review Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setErrors(prev => ({ ...prev, title: '' }));
          }}
          placeholder="Summarize your review..."
          className="w-full rounded-lg border border-slate-500/20 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-slate-700/50 focus:outline-none focus:ring-4 focus:ring-slate-700/10"
        />
        {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (e.target.value.trim().length >= 10) setErrors(prev => ({ ...prev, comment: '' }));
          }}
          placeholder="Share your detailed experience..."
          rows={5}
          className="w-full resize-none rounded-lg border border-slate-500/20 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-slate-700/50 focus:outline-none focus:ring-4 focus:ring-slate-700/10"
        />
        <div className="flex justify-between items-end mt-2">
          <div>
            {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
          </div>
          <span className="text-xs text-slate-500">{comment.length} characters</span>
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Add Photo (Optional)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {!imagePreview ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-300 rounded-lg py-8 flex flex-col items-center justify-center gap-2 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Camera size={24} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Click to upload a photo</span>
            <span className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</span>
          </button>
        ) : (
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setImage(null);
              }}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Send size={18} />
          Post Review
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/**
 * RecensionCard - Component for displaying individual recensions
 */
interface RecensionCardProps {
  recension: Recension;
  onToggleLike: (recensionId: number, action: Exclude<UserLike, null>) => void;
  isOwnReview: boolean;
}

function RecensionCard({ recension, onToggleLike, isOwnReview }: RecensionCardProps) {
  const timeAgo = getTimeAgo(recension.createdAt);

  return (
    <div className="rounded-xl border border-slate-500/10 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:border-slate-500/20 hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {recension.userInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900">{recension.userName}</p>
              {isOwnReview && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">You</span>
              )}
            </div>
            <p className="text-sm text-slate-500">{timeAgo}</p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < recension.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-bold text-slate-900 font-serif">{recension.title}</h3>

      {/* Comment */}
      <p className="text-slate-700 mb-4 leading-relaxed">{recension.comment}</p>

      {/* Image */}
      {recension.image && (
        <img
          src={recension.image}
          alt="Review"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      {/* Interactions */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
        <button
          onClick={() => onToggleLike(recension.id, 'like')}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
            recension.userLike === 'like'
              ? 'border-rose-600/20 bg-rose-600/10 text-rose-600'
              : 'border-transparent bg-transparent text-inherit hover:border-slate-500/20 hover:bg-slate-500/10'
          }`}
        >
          <Heart size={16} />
          <span>{recension.likes}</span>
        </button>
        <button
          onClick={() => onToggleLike(recension.id, 'dislike')}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
            recension.userLike === 'dislike'
              ? 'border-slate-500/20 bg-slate-500/10 text-slate-500'
              : 'border-transparent bg-transparent text-inherit hover:border-slate-500/20 hover:bg-slate-500/10'
          }`}
        >
          <ThumbsDown size={16} />
          <span>{recension.dislikes}</span>
        </button>
      </div>
    </div>
  );
}

