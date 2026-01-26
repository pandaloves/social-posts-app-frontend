import {useState} from "react";

// Form for user to write a new post
// takes onSubmit(content) from wall.jxs
export default function PostForm({onSubmit}){
    const [content, setContent] = useState(''); //user input
    const [submitting, setSubmitting] = useState(false); //currently submitting, default false
    const [error, setError] = useState(null); //holds error messages

    //on submit actions
    const handleSubmit = async (e) => {
        e.preventDefault(); //prevent default HTML submit actions
        //blank content check
        const trimmed = content?.trim() ?? '';
        if (!trimmed) return;

        try {
            //submit and reset text on success
            setSubmitting(true);
            setError(null);
            await onSubmit(trimmed);
            setContent('');
        } catch (err) {
            console.error(err);
            setError('Failed to create post');
        } finally {
            //reset submitting to default value
            setSubmitting(false);
        }
    };


    return (
        //page rendering
        <form
            //submit action
            onSubmit={handleSubmit}
            //textbox container styling
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6"
        >
    <textarea
        //textbox styling
        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
        rows={3}
        placeholder="Write something!"
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={submitting}
    />

            {/*error styling*/}
            {error && (
                <div className="mt-2 text-sm text-red-500">
                    {error}
                </div>
            )}

            {/*submit button styling*/}
            <div className="mt-3 flex justify-end">
                <button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                >
                    {submitting ? 'Posting...' : 'Post'}
                </button>
            </div>
        </form>
    );
}