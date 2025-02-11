import React, { useEffect, useState } from "react";
import axios from "axios";
import { farmingTypes } from "../farmingTypes";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ 
        title: "", 
        farmingType: "crops", 
        authorName: "", 
        authorEmail: "", 
        sections: [{ subHeading: "", text: "", imageUrl: "" }] 
    });

    useEffect(() => {
        axios.get("http://localhost:3001/api/posts?farmingType=crops")
            .then(response => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSectionChange = (index, e) => {
        const newSections = [...formData.sections];
        newSections[index][e.target.name] = e.target.value;
        setFormData({ ...formData, sections: newSections });
    };

    const addSection = () => {
        setFormData({ 
            ...formData, 
            sections: [...formData.sections, { subHeading: "", text: "", imageUrl: "" }] 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/api/posts", {
                title: formData.title,
                farmingType: formData.farmingType,
                author: { name: formData.authorName, email: formData.authorEmail },
                sections: formData.sections
            });
            setPosts([...posts, response.data]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-300 p-6">
            <h1 className="text-4xl font-bold text-center text-white mb-6">Farming Blog</h1>
            
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Add a New Post</h2>
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-2 mb-4 bg-gray-700 text-white border rounded focus:ring-blue-400 focus:border-blue-400" required />
                <select 
                    name="farmingType" 
                    value={formData.farmingType} 
                    onChange={handleChange} 
                    className="w-full p-2 mb-4 bg-gray-700 text-white border rounded focus:ring-blue-400 focus:border-blue-400"
                >
                    {farmingTypes.map(type => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')}
                        </option>
                    ))}
                </select>
                <input type="text" name="authorName" placeholder="Author Name" value={formData.authorName} onChange={handleChange} className="w-full p-2 mb-4 bg-gray-700 text-white border rounded focus:ring-blue-400 focus:border-blue-400" required />
                <input type="email" name="authorEmail" placeholder="Author Email" value={formData.authorEmail} onChange={handleChange} className="w-full p-2 mb-4 bg-gray-700 text-white border rounded focus:ring-blue-400 focus:border-blue-400" required />
                
                <h3 className="text-xl font-bold text-white mb-4">Sections</h3>
                {formData.sections.map((section, index) => (
                    <div key={index} className="mb-4 bg-gray-700 p-4 rounded-lg">
                        <input type="text" name="subHeading" placeholder="Subheading" value={section.subHeading} onChange={(e) => handleSectionChange(index, e)} className="w-full p-2 mb-2 bg-gray-600 text-white border rounded focus:ring-blue-400 focus:border-blue-400" required />
                        <textarea name="text" placeholder="Text" value={section.text} onChange={(e) => handleSectionChange(index, e)} className="w-full p-2 mb-2 bg-gray-600 text-white border rounded focus:ring-blue-400 focus:border-blue-400" required></textarea>
                        <input type="text" name="imageUrl" placeholder="Image URL" value={section.imageUrl} onChange={(e) => handleSectionChange(index, e)} className="w-full p-2 mb-2 bg-gray-600 text-white border rounded focus:ring-blue-400 focus:border-blue-400" />
                    </div>
                ))}
                <button type="button" onClick={addSection} className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-500 transition-all mb-4">Add Section</button>
                
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition-all">Add Post</button>
            </form>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-center text-gray-400">Loading posts...</p>
                ) : posts.length === 0 ? (
                    <p className="text-center text-gray-400">No posts found.</p>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                            <div className="p-4">
                                <h2 className="text-2xl font-semibold text-white">{post.title}</h2>
                                <p className="text-gray-400">{new Date(post.createdAt).toDateString()}</p>
                                {post.sections?.map((section, idx) => (
                                    <div key={idx} className="mt-2">
                                        <h3 className="text-lg text-white font-semibold">{section.subHeading}</h3>
                                        <p className="text-gray-300">{section.text}</p>
                                        {section.imageUrl && <img src={section.imageUrl} alt="Section" className="mt-2 rounded-lg" />}
                                    </div>
                                ))}
                                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all">Read More</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Posts;
