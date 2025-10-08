# E-Commerce React Application

e-commerce web application built with React, TypeScript, Redux Toolkit, and React Query. This project includes state management, data fetching, routing, and persistent storage.

## Live Demo

[Add your deployed app link here]

### Features

### ProductCatalog

- Fetches and displays products using React Query
- Handles category filtering
- Provides add-to-cart functionality
- Implements image error handling

### Navbar

- Dynamic category dropdown from API
- Real-time cart item count display
- Navigation between application sections

### AddToCart (Shopping Cart)

- Display cart items with images and details
- Quantity increment/decrement controls
- Remove items functionality
- Cart total calculations

### Checkout

- Order summary display
- Tax calculations and total computation
- Cart clearing and order processing
- Navigation to order confirmation

### PlaceOrder

- Order confirmation details
- Order number generation and persistence
- Final order summary display

### Error Handling

- Network error recovery with React Query retries
- Image loading fallbacks for broken URLs
- User-friendly error messages

## API Integration

### FakeStore API Endpoints

- `GET /products` - Fetch all products
- `GET /products/categories` - Get product categories
- `GET /products/category/{category}` - Get products by category
- `GET /products/{id}` - Get individual product details

## Technologies Used

- **React 19.1.1**
- **TypeScript**
- **Vite**
- **Redux Toolkit 2.9.0**
- **React-Redux 9.2.0**
- **TanStack React Query 5.90.2**
- **Axios 1.12.2**
- **React Bootstrap 2.10.10**
- **Bootstrap 5.3.8**
- **React Icons 5.5.0**
- **React Router DOM 7.9.3**

## Project Structure

```
src/
├── components/
│   ├── AddToCart.tsx
│   ├── Checkout.tsx
│   ├── Navbar.tsx
│   ├── PlaceOrder.tsx
│   ├── ProductCatalog.tsx
│   ├── ProductDetail.tsx
│   └── ProductRating.tsx
├── Redux/
│   ├── store.ts
│   └── cartSlice.ts
├── App.tsx
├── main.tsx
└── App.css
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone [https://github.com/alhadwan/E-Commerce-App.git]
   cd ecommerce-app-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```
