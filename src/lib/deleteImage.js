import fs from 'fs';
import path from 'path';

const deleteImage = (imagePath) => {

    if (imagePath && imagePath !== '/assets/admin/product-placeholder.webp') {
        const imageFilePath = path.join(process.cwd(), 'public', imagePath);


        if (fs.existsSync(imageFilePath)) {
            fs.unlinkSync(imageFilePath);
            console.log('Image deleted:', imageFilePath);
        } else {
            console.log('Image not found:', imageFilePath);
        }
    }
};

export default deleteImage;