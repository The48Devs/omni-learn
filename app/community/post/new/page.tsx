"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Code2, Bold, List, AlertCircle, BookOpen } from 'lucide-react';
import { useCommunity } from '../../../components/community/CommunityContext';
import { useCommunityBasePath } from '../../../components/community/CommunityBasePathContext';

export default function NewPost() {
  const { categories, addPost, getUser, currentUserId } = useCommunity();
  const basePath = useCommunityBasePath();
  const router = useRouter();
  const currentUser = getUser(currentUserId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [courseLinked, setCourseLinked] = useState(false);
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const addTag = () => {
    const clean = tagInput.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (clean && tags.length < 5 && !tags.includes(clean)) {
      setTags(t => [...t, clean]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(t => t.filter(x => x !== tag));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 10) e.title = 'Title must be at least 10 characters.';
    if (!content.trim() || content.trim().length < 30) e.content = 'Post body must be at least 30 characters.';
    if (!categoryId) e.category = 'Please select a category.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const courseId = courseLinked && currentUser?.activeCourses[0]
      ? currentUser.activeCourses[0].id
      : undefined;
    const id = addPost({ title: title.trim(), content: content.trim(), categoryId, tags, courseId });
    router.push(`${basePath}/post/${id}`);
  };

  const insertCode = () => {
    const snippet = '\n```\n// paste your code here\n```\n';
    setContent(c => c + snippet);
  };

  const insertBold = () => setContent(c => c + '**bold text**');
  const insertList = () => setContent(c => c + '\n- Item one\n- Item two\n- Item three\n');

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">New Discussion</h1>
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 flex gap-3">
        <AlertCircle size={18} className="text-teal-600 shrink-0 mt-0.5" />
        <div className="text-sm text-teal-800">
          <p className="font-semibold mb-1">Before you post</p>
          <ul className="list-disc list-inside space-y-0.5 text-teal-700 text-xs">
            <li>Search existing discussions to see if your question is already answered</li>
            <li>Include relevant code snippets (use the ``` button)</li>
            <li>Tag with specific topics so others can find your post</li>
          </ul>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); setErrors(er => ({ ...er, title: '' })); }}
            placeholder="What's your question or topic?"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors ${
              errors.title
                ? 'border-red-300 focus:border-red-400 focus:ring-red-300'
                : 'border-gray-200 focus:border-teal-400 focus:ring-teal-400'
            }`}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          <p className="text-xs text-gray-400 mt-1">{title.length}/150 characters</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.filter(c => c.id !== 'cat-announce').map(cat => (
              <button
                key={cat.id}
                onClick={() => { setCategoryId(cat.id); setErrors(er => ({ ...er, category: '' })); }}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                  categoryId === cat.id
                    ? `${cat.bgColor} ${cat.color} ${cat.borderColor} ring-1 ring-offset-0`
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Body <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                onClick={insertBold}
                title="Bold"
                className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <Bold size={14} />
              </button>
              <button
                onClick={insertCode}
                title="Code block"
                className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <Code2 size={14} />
              </button>
              <button
                onClick={insertList}
                title="List"
                className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <List size={14} />
              </button>
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <button
                onClick={() => setPreview(o => !o)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  preview
                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Eye size={13} />
                {preview ? 'Editing' : 'Preview'}
              </button>
            </div>
          </div>

          {preview ? (
            <div className="min-h-40 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 bg-gray-50 whitespace-pre-wrap leading-relaxed">
              {content || <span className="text-gray-400 italic">Nothing to preview yet…</span>}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={e => { setContent(e.target.value); setErrors(er => ({ ...er, content: '' })); }}
              placeholder={`Describe your question in detail.\n\nInclude:\n- What you've already tried\n- Relevant code snippets\n- Error messages if any`}
              rows={10}
              className={`w-full px-4 py-3 border rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-1 transition-colors leading-relaxed ${
                errors.content
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-300'
                  : 'border-gray-200 focus:border-teal-400 focus:ring-teal-400'
              }`}
            />
          )}
          {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Tags <span className="text-gray-400 font-normal">(up to 5)</span>
          </label>
          <div className="flex gap-2 flex-wrap mb-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-700 text-xs rounded-full font-medium"
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-500 transition-colors ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {tags.length < 5 && (
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
                placeholder="e.g. react, hooks, typescript"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add a tag</p>
        </div>

        {currentUser && currentUser.activeCourses.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl">
            <BookOpen size={16} className="text-teal-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700 mb-0.5">Link to a Course</p>
              <p className="text-xs text-gray-500 mb-2">Help others find course-specific discussions.</p>
              <div className="flex items-center gap-2 flex-wrap">
                {currentUser.activeCourses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => setCourseLinked(v => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                      courseLinked
                        ? 'bg-teal-50 text-teal-700 border-teal-200 font-medium'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-teal-200'
                    }`}
                  >
                    {course.name} — {course.module}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-teal-700 text-white text-sm font-semibold rounded-lg hover:bg-teal-800 disabled:opacity-60 transition-colors"
          >
            {submitting ? 'Posting…' : 'Post Discussion'}
          </button>
          <Link
            href={basePath}
            className="px-6 py-2.5 bg-white border border-gray-200 text-sm text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
