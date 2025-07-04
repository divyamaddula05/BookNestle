import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Address } from '../../types';
import { countries, getStatesByCountry } from '../../data/countries';

interface AddressFormProps {
  address?: Address;
  onSave: (address: Address) => void;
  onCancel: () => void;
  title: string;
}

export default function AddressForm({ address, onSave, onCancel, title }: AddressFormProps) {
  const [formData, setFormData] = useState({
    label: address?.label || '',
    name: address?.name || '',
    street: address?.street || '',
    apartment: address?.apartment || '',
    city: address?.city || '',
    state: address?.state || '',
    zipCode: address?.zipCode || '',
    country: address?.country || 'US',
    phone: address?.phone || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableStates, setAvailableStates] = useState(getStatesByCountry(formData.country));

  useEffect(() => {
    const states = getStatesByCountry(formData.country);
    setAvailableStates(states);
    
    // Reset state if the new country doesn't have the current state
    if (states.length > 0 && !states.find(state => state.code === formData.state)) {
      setFormData(prev => ({ ...prev, state: '' }));
    }
  }, [formData.country]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) newErrors.label = 'Label is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    // State validation - only required if the country has states
    if (availableStates.length > 0 && !formData.state.trim()) {
      newErrors.state = 'State/Province is required';
    }

    // ZIP code validation - only for certain countries
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Postal/ZIP code is required';
    } else {
      // Different validation patterns for different countries
      switch (formData.country) {
        case 'US':
          if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Invalid ZIP code format (e.g., 12345 or 12345-6789)';
          }
          break;
        case 'CA':
          if (!/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Invalid postal code format (e.g., K1A 0A6)';
          }
          break;
        case 'GB':
          if (!/^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Invalid postcode format (e.g., SW1A 1AA)';
          }
          break;
        case 'DE':
          if (!/^\d{5}$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Invalid postal code format (e.g., 12345)';
          }
          break;
        case 'FR':
          if (!/^\d{5}$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Invalid postal code format (e.g., 75001)';
          }
          break;
        case 'AU':
          if (!/^\d{4}$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Invalid postcode format (e.g., 2000)';
          }
          break;
        case 'JP':
          if (!/^\d{3}-?\d{4}$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Invalid postal code format (e.g., 100-0001)';
          }
          break;
        case 'IN':
          if (!/^\d{6}$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Invalid PIN code format (e.g., 110001)';
          }
          break;
        case 'BR':
          if (!/^\d{5}-?\d{3}$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Invalid CEP format (e.g., 01310-100)';
          }
          break;
        case 'MX':
          if (!/^\d{5}$/.test(formData.zipCode)) {
            newErrors.zipCode = 'Invalid postal code format (e.g., 01000)';
          }
          break;
        default:
          // Generic validation for other countries
          if (formData.zipCode.length < 3 || formData.zipCode.length > 10) {
            newErrors.zipCode = 'Postal code must be between 3 and 10 characters';
          }
      }
    }

    // Phone number validation (basic international format)
    if (formData.phone && !/^[\+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newAddress: Address = {
      id: address?.id || `addr-${Date.now()}`,
      label: formData.label,
      name: formData.name,
      street: formData.street,
      apartment: formData.apartment || undefined,
      city: formData.city,
      state: formData.state || undefined,
      zipCode: formData.zipCode,
      country: formData.country,
      phone: formData.phone || undefined,
      isDefault: address?.isDefault || false,
    };

    onSave(newAddress);
  };

  const getPostalCodeLabel = (countryCode: string) => {
    switch (countryCode) {
      case 'US': return 'ZIP Code';
      case 'CA': return 'Postal Code';
      case 'GB': return 'Postcode';
      case 'AU': return 'Postcode';
      case 'IN': return 'PIN Code';
      case 'BR': return 'CEP';
      default: return 'Postal Code';
    }
  };

  const getPostalCodePlaceholder = (countryCode: string) => {
    switch (countryCode) {
      case 'US': return '12345 or 12345-6789';
      case 'CA': return 'K1A 0A6';
      case 'GB': return 'SW1A 1AA';
      case 'DE': return '12345';
      case 'FR': return '75001';
      case 'AU': return '2000';
      case 'JP': return '100-0001';
      case 'IN': return '110001';
      case 'BR': return '01310-100';
      case 'MX': return '01000';
      default: return 'Enter postal code';
    }
  };

  const getStateLabel = (countryCode: string) => {
    switch (countryCode) {
      case 'US': return 'State';
      case 'CA': return 'Province';
      case 'AU': return 'State/Territory';
      case 'GB': return 'Country';
      case 'DE': return 'State';
      case 'FR': return 'Region';
      case 'IN': return 'State/UT';
      case 'JP': return 'Prefecture';
      case 'BR': return 'State';
      case 'MX': return 'State';
      default: return 'State/Province';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
              Address Label *
            </label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              placeholder="e.g., Home, Work, Office"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                errors.label ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.label && <p className="text-red-600 text-sm mt-1">{errors.label}</p>}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Recipient's full name"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
              errors.country ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
        </div>

        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            placeholder="Street address"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
              errors.street ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.street && <p className="text-red-600 text-sm mt-1">{errors.street}</p>}
        </div>

        <div>
          <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            value={formData.apartment}
            onChange={handleInputChange}
            placeholder="Apt, Suite, Floor, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                errors.city ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
          </div>

          {availableStates.length > 0 && (
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                {getStateLabel(formData.country)} *
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                  errors.state ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select {getStateLabel(formData.country)}</option>
                {availableStates.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
            </div>
          )}

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              {getPostalCodeLabel(formData.country)} *
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder={getPostalCodePlaceholder(formData.country)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                errors.zipCode ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Save className="h-4 w-4" />
            <span>Save Address</span>
          </button>
        </div>
      </form>
    </div>
  );
}