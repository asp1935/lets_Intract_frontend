import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAddGallery } from '../../hooks/usePortfolio';
import { showToast } from '../../redux/slice/ToastSlice';
import { X } from 'lucide-react';

function AddGallery({ uid, setAddGallery, pid, onGalleryAdded }) {
    const [galleryItems, setGalleryItems] = useState([
        { file: null, type: 'img', title: '' }
    ])

    const dispatch = useDispatch();
    const addGalleryItem = useAddGallery();

    // Handle input change for a specific item
    const handleChange = (index, e) => {
        const { name, value, files } = e.target;
        const updatedGalleryItem = [...galleryItems];
        if (name === 'data') {
            updatedGalleryItem[index].file = files[0];
        } else {
            updatedGalleryItem[index][name] = value;
        }
        setGalleryItems(updatedGalleryItem);
    };

    // Add a new blank items (max 5 allowed)
    const addNewGalleryItem = () => {
        if (galleryItems.length < 5) {
            setGalleryItems([...galleryItems, { file: null, type: 'img', name: '' }]);
        }
    };

    // Delete a specific item
    const removeItem = (index) => {
        const updatedGalleryItem = galleryItems.filter((_, i) => i !== index);
        setGalleryItems(updatedGalleryItem);
    };
    const validate = () => {
        for (let item of galleryItems) {
            if (!item.title?.trim() || !item.file) {
                dispatch(showToast({ message: 'All  fields are required (Title and Image/Video)', type: 'warn' }));
                return false;
            }
            if (!['img', 'video'].includes(item.type)) {

                dispatch(showToast({ message: "Invalid Type Selected" }))
                return false;
            }
            const fileType = item.file.type;

            if (item.type === 'img' && !fileType.startsWith('image/')) {
                dispatch(showToast({ message: "File type does not match selected 'Image'", type: 'warn' }));
                return false;
            }

            if (item.type === 'video' && !fileType.startsWith('video/')) {
                dispatch(showToast({ message: "File type does not match selected 'Video'", type: 'warn' }));
                return false;
            }
        }
        return true;
    };
    const handleSubmitGalleryItem = () => {
        if (validate()) {
            const files = galleryItems.map(item => item.file);
            const gallery = galleryItems.map(item => ({ title: item.title, type: item.type }));

            addGalleryItem.mutate({ userId: uid, portfolioId: pid, gallery, files }, {
                onSuccess: (data) => {
                    setAddGallery(false);
                    onGalleryAdded(data?.data?.gallery)
                    dispatch(showToast({ message: 'Gallery Item Added Successfully' }))
                },
                onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
            });
        }
    };
    return (
        <div className='w-full my-5  bg-white shadow-xl rounded-xl border overflow-clip'>
            <div className='flex justify-between p-2 bg-[#fb52c3] '>
                <h3 className='mx-3 text-xl font-semibold'>Add Clients</h3>
                <button className='cursor-pointer outline-0' onClick={() => setAddGallery(false)}><X /></button>
            </div>

            <div className='w-10/12 mx-auto'>
                <div className='p-5 space-y-6'>
                    {galleryItems.map((item, index) => (
                        <div key={index} className='relative border p-4 rounded space-y-4 shadow'>
                            {galleryItems.length > 0 && (
                                <button
                                    onClick={() => removeItem(index)}
                                    className='absolute top-2 right-2 text-gray-500 hover:text-red-600'
                                >
                                    <X size={18} />
                                </button>
                            )}
                            <div className='flex flex-col'>
                                <label htmlFor={`title-${index}`}>Title</label>
                                <input
                                    type='text'
                                    name="title"
                                    id={`title-${index}`}
                                    placeholder='Title'
                                    value={item.title}
                                    onChange={(e) => handleChange(index, e)}
                                    className='resize-none border p-1 rounded'
                                    required
                                />
                            </div>
                            <div className='flex gap-x-5 justify-center'>

                                <div className='flex flex-col'>
                                    <label htmlFor={`type-${index}`}>Select File Type:</label>
                                    <select
                                        id={`type-${index}`}
                                        name="type"
                                        value={item.type}
                                        onChange={(e) => handleChange(index, e)}
                                        className="cursor-pointer ms-5 mt-2 p-2 border rounded"
                                    >
                                        <option value="img">Image</option>
                                        <option value="video">Video</option>
                                    </select>
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor={`file-${index}`}>Logo :</label>
                                    <input
                                        type="file"
                                        name="data"
                                        id={`file-${index}`}
                                        placeholder='File'
                                        // value={client.title}
                                        onChange={(e) => handleChange(index, e)}
                                        className='border p-1.5 rounded ms-5 mt-2'
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {galleryItems.length < 5 && (
                        <button
                            onClick={addNewGalleryItem}
                            className='border px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 focus:scale-95 text-white'
                        >
                            + Add Another Item
                        </button>
                    )}
                </div>
            </div>

            <div className='flex gap-3 justify-end p-3'>
                <button className='border px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white' onClick={() => setAddGallery(false)}>Cancel</button>
                <button className='border px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white font-sembold' onClick={handleSubmitGalleryItem}>Save</button>
            </div>
        </div>
    )
}

export default AddGallery
