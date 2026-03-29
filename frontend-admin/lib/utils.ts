import { ApiOrder } from '@/lib/api';
import { ProductFormValues } from '@/lib/types';

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}


export function getOrderItemCount(order: ApiOrder) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getProductFormDefaults(): ProductFormValues {
  return {
    name: '',
    slug: '',
    category: '',
    shortDescription: '',
    description: '',
    price: '',
    image: '/images/coffee-1.svg',
    roastLevel: '',
    origin: '',
    featured: false,
    bestSeller: false,
    stock: '0',
  };
}
