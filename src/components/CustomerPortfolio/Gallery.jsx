import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useDeletePortfolioItem } from '../../hooks/usePortfolio';
import { showToast } from '../../redux/slice/ToastSlice';
import { ExternalLink } from 'lucide-react';
import AddGallery from './AddGallery';

function Gallery({ uid, pid, galleryData }) {
    const [addGallery, setAddGallery] = useState(false);
    const [galleryItem, setGalleryItem] = useState([]);
    const url = import.meta.env.VITE_IMG_URL;


    const dispatch = useDispatch();

    const deleteGalleryItem = useDeletePortfolioItem();

    useEffect(() => {
        setGalleryItem(galleryData)

    }, [galleryData])

    const handleDeleteGalleryItem = (id) => {
        deleteGalleryItem.mutate({ portfolioId: pid, itemId: id, type: "gallery" }, {
            onSuccess: (data) => {
                setGalleryItem(data?.data?.gallery)
                dispatch(showToast({ message: 'Gallery Item Deleted Successfully' }))
            },
            onError: (error) => dispatch(showToast({ message: error, type: 'error' }))
        })
    }
    return (
        <div className={`w-9/12 mx-auto place-items-center p-4 rounded my-5 border bg-] relative `}>
            <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
            {addGallery && <AddGallery uid={uid} setAddGallery={setAddGallery} pid={pid} onGalleryAdded={(newGalleryItem) => setGalleryItem(newGalleryItem)} />}

            {galleryItem && galleryItem.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-700 mb-4">No Clients available.</p>
                    <button
                        onClick={() => setAddGallery(!addGallery)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded"
                    >
                        Add Gallery Items
                    </button>
                </div>
            ) : (
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border border-gray-300">
                        <thead className='text-center'>
                            <tr className="bg-purple-200">
                                <th className="py-2 px-4 border">Image/Video</th>
                                <th className="py-2 px-4 border">Title</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {galleryItem?.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border place-items-center">
                                        {item?.type === 'img' ? (
                                            item?.url ? (
                                                <img
                                                    className='w-24 h-14'
                                                    src={item?.url ? `${url}${item.url}` : '../../assets/profile.jpg'} />
                                            ) : (
                                                <p>Image Not Available</p>
                                            )

                                        ) : (
                                            item?.url ? (
                                                <a href={item?.url ? `${url}${item.url}` : '../../assets/profile.jpg'} target='_blank' className='hover:text-blue-700'>View Video <ExternalLink className='inline-block w-5'/> </a>
                                            ) : (
                                                <p>Video Not Available</p>

                                            )
                                        )}

                                    </td>
                                    <td className="py-2 px-4 border">{item.title}</td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            onClick={() => handleDeleteGalleryItem(item._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex justify-end my-3'>
                        <button
                            onClick={() => setAddGallery(!addGallery)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded"
                        >
                            Add Gallery Item
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Gallery
