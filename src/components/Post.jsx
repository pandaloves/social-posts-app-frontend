import { useState } from 'react';

//get a single post with opitional delete or edit action
export default function Post({ post, isOwnPost, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false); //isEditing default false
    const [editContent, setEditContent] = useState(post?.content ?? '');//inital editContent is post.content

    //save edited content action
    const handleSave = async () => {
        await onUpdate(post.id, editContent); //update post in wall/feed
        setIsEditing(false);
    };

    return (
        //outer box
        <div className="border border-gray-200 rounded-lg p-4">
            {/*header with user, date and actions*/}
            <div className="flex justify-between items-start mb-2">
                <div>
                    {/*user name*/}
                    <div className="font-semibold">
                        {post.author?.username ?? 'Unknown user'}
                    </div>
                    {/*created at and/or updated at*/}
                    <div className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                        {post.updatedAt && (
                            <span className="ml-2">(edited)</span>
                        )}
                    </div>
                </div>

                {/*if is own post, edit and delete buttons + actions*/}
                {isOwnPost && (
                    <div className="space-x-2 text-sm">
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setIsEditing(prev => !prev)}
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                        <button
                            className="text-red-600 hover:underline"
                            onClick={() => onDelete(post.id)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div>
          <textarea
              className="w-full border rounded p-2 text-sm"
              rows={3}
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
          />
                    <div className="mt-2 flex justify-end space-x-2 text-sm">
                        <button
                            className="px-3 py-1 rounded border"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-3 py-1 rounded bg-blue-600 text-white"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                //normal view, not editing
                <p className="mt-2 whitespace-pre-wrap text-sm">
                    {post.content}
                </p>
            )}
        </div>
    );
}
