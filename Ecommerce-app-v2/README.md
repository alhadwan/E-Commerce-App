# E-Commerce React Application

A full-featured e-commerce web application built with React, TypeScript, Redux Toolkit, and Firebase. This project includes Firebase authentication, Firestore database, state management, routing, and complete CRUD operations for products and user management.

## Live Demo

https://e-commerce-app-three-kohl.vercel.app/

## Features

### Authentication & User Management

- **Firebase Authentication**
- **User Profiles**
- **Account Management**
- **Persistent Sessions**

### Product Management

- **Product Catalog**
- **Product Details**
- **Add Product**
- **Edit Product**
- **Delete Product**
- **Firebase Storage**

### Shopping Cart & Orders

- **Shopping Cart**
- **Checkout Process**
- **Order History**
- **Order Confirmation**
- **Cart Persistence**

### Additional Features

- **Responsive Design**
- **Loading States**
- **Error Handling**
- **Type Safety**
- **Real-time Updates**

## Firebase Integration

### Authentication

- **Firebase Auth**
- **User Sessions**
- **Protected Routes**

### Firestore Database Collections

- **Products** (`/products`)
- **Users** (`/users`)
- **Orders** (`/orders`)
- **Categories** (`/categories`)

### Firebase Features Used

- **Authentication**
- **Firestore Database**
- **Real-time Updates**
- **Security Rules**
- **Composite Indexes**

## Technologies Used

### Frontend

- **React 19.1.1**
- **TypeScript**
- **Vite**
- **Redux Toolkit 2.9.0**
- **React-Redux 9.2.0**

### Backend & Database

- **Firebase 12.4.0**
- **Firebase Authentication**
- **Firestore Database**
- **Firebase Security Rules**

### UI & Styling

- **React Bootstrap 2.10.10**
- **Bootstrap 5.3.8**
- **React Icons 5.5.0**

### Routing & HTTP

- **React Router DOM 7.9.3**
- **Axios 1.12.2**

## Project Structure

```
src/
├── components/
│   ├── AddProduct.tsx
│   ├── AddToCart.tsx
│   ├── Checkout.tsx
│   ├── DeleteAccount.tsx
│   ├── DeleteProduct.tsx
│   ├── EditProduct.tsx
│   ├── Login.tsx
│   ├── Navbar.tsx
│   ├── Orders.tsx
│   ├── ProductCatalog.tsx
│   ├── ProductDetail.tsx
│   ├── ProductRating.tsx
│   ├── Registration.tsx
│   ├── placeOrder.tsx
│   └── profile.tsx
├── Redux/
│   ├── store.ts
│   └── cartSlice.ts
├── hooks/
│   └── useAuth.ts
├── seeder/
│   └── [seeder files]
├── firebaseConfig.ts
├── App.tsx
├── main.tsx
└── App.css
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Firebase account for backend services

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/alhadwan/E-Commerce-App.git
   cd E-Commerce-App
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create Firestore Database
   - Copy your Firebase config and update `src/firebaseConfig.ts`

4. **Environment Setup**
   - Configure Firebase settings in `firebaseConfig.ts`
   - Ensure Firestore security rules are properly configured

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Build for production**

   ```bash
   npm run build
   ```

7. **Preview production build**
   ```bash
   npm run preview
   ```

## Author

**Ali Hadwan**

- GitHub: [@alhadwan](https://github.com/alhadwan)
- Project Link: [E-Commerce App](https://github.com/alhadwan/E-Commerce-App)
