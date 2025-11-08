# Ecommerce API Structure

This directory contains the complete backend API structure for the ecommerce application using MongoDB and Cloudinary.

## Directory Structure

```
src/app/api/
├── config/           # Database and cloud configurations
│   ├── mongoose.ts   # MongoDB connection
│   ├── cloudinary.ts # Cloudinary setup
│   └── env.ts        # Environment variables
├── models/           # Database models
│   ├── User.ts       # User accounts
│   ├── Product.ts    # Products catalog
│   ├── Category.ts   # Categories & subcategories
│   ├── Order.ts      # Customer orders
│   ├── Review.ts     # Product reviews
│   └── Discount.ts   # Promotional codes
├── controllers/      # Business logic controllers
│   ├── authController.ts      # Authentication
│   ├── productController.ts   # Product operations
│   ├── categoryController.ts  # Category operations
│   ├── userController.ts      # User management
│   ├── orderController.ts     # Order management
│   └── uploadController.ts    # File uploads
├── routes/           # API route handlers
│   ├── auth/
│   │   ├── register/route.ts
│   │   └── login/route.ts
│   ├── products/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── categories/
│   │   └── route.ts
│   ├── users/
│   │   └── route.ts
│   ├── orders/
│   │   └── route.ts
│   └── upload/
│       └── route.ts
├── middleware/       # Authentication middleware
│   └── auth.ts
└── utils/            # Utility functions
    └── cloudinary.ts
```

## Setup

1. Install dependencies:
```bash
npm install mongoose bcryptjs jsonwebtoken cloudinary multer
```

2. Set up environment variables in your `.env` file:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Environment
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with filtering)
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get a single product
- `PUT /api/products/[id]` - Update a product
- `DELETE /api/products/[id]` - Delete a product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category

### Users
- `GET /api/users` - Get all users (admin only)

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create a new order

### Upload
- `POST /api/upload` - Upload images to Cloudinary

## Features

- **Authentication**: JWT-based with role-based access (user, vendor, admin, master)
- **Image Management**: Cloudinary integration for product images
- **Product Management**: Full CRUD with variants, categories, and inventory
- **Order Processing**: Complete order lifecycle with status tracking
- **Category Hierarchy**: Parent/child category relationships
- **User Roles**: Different access levels for different user types

## Database Models

- **User**: Account management with roles and authentication
- **Product**: Comprehensive product catalog with variants and images
- **Category**: Hierarchical category system
- **Order**: Order management with payment and shipping tracking
- **Review**: Customer reviews and ratings system
- **Discount**: Promotional codes and discounts

The API is fully functional and ready for frontend integration!
