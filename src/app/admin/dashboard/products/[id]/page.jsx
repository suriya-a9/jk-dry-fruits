import DashboardLayout from '@/components/DashboardLayout';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function ProductPage({ params }) {
    await dbConnect();

    const id = params?.id;

    let product;

    try {
        product = await Product.findById(id)
            .populate('category', 'name')
            .populate('variations.weightUnit', 'label')
            .populate('comboItems.weightUnit', 'label')
            .lean();
    } catch (error) {
        console.error(error);
        return <div>Error loading product.</div>;
    }

    if (!product) {
        return <div>Product not found.</div>;
    }

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: '0 0 250px' }}>
                    <img
                        src={product.image || '/placeholder.png'}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <h2>{product.name}</h2>
                    {product.price && (
                        <p><strong>Price:</strong> ₹{product.price}</p>
                    )}
                    {/* <p><strong>Description:</strong> {product.description || 'No description available.'}</p> */}
                    <p><strong>Category:</strong> {product.category?.name || 'N/A'}</p>

                    {/* Variations */}
                    {product.variations?.length > 0 && (
                        <div className="mt-3">
                            <h5>Variations</h5>
                            <ul style={{ paddingLeft: '1rem' }}>
                                {product.variations.map((variation, index) => (
                                    <li key={index}>
                                        {variation.weight} {variation.weightUnit?.label || ''} - ₹{variation.price}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Combo Items */}
                    {product.comboItems?.length > 0 && (
                        <div className="mt-3">
                            <h5>Combo Items</h5>
                            <ul style={{ paddingLeft: '1rem' }}>
                                {product.comboItems.map((item, index) => (
                                    <li key={index}>
                                        {item.name} - {item.weight} {item.weightUnit?.label || ''}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}