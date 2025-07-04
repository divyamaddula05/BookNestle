import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Check } from 'lucide-react';
import { Address } from '../../types';
import { useAppContext } from '../../context/AppContext';
import AddressForm from './AddressForm';

interface AddressSelectorProps {
  onAddressSelect?: (address: Address) => void;
  showAddNew?: boolean;
}

export default function AddressSelector({ onAddressSelect, showAddNew = true }: AddressSelectorProps) {
  const { state, dispatch } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const addresses = state.auth.user?.addresses || [];
  const selectedAddress = state.selectedDeliveryAddress;

  const handleAddressSelect = (address: Address) => {
    dispatch({ type: 'SET_DELIVERY_ADDRESS', payload: address });
    onAddressSelect?.(address);
  };

  const handleSetDefault = (addressId: string) => {
    dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: addressId });
  };

  const handleDeleteAddress = (addressId: string) => {
    if (addresses.length <= 1) {
      alert('You must have at least one address.');
      return;
    }
    dispatch({ type: 'DELETE_ADDRESS', payload: addressId });
  };

  const handleAddAddress = (address: Address) => {
    dispatch({ type: 'ADD_ADDRESS', payload: address });
    setShowAddForm(false);
  };

  const handleUpdateAddress = (address: Address) => {
    dispatch({ type: 'UPDATE_ADDRESS', payload: address });
    setEditingAddress(null);
  };

  const formatAddress = (address: Address) => {
    return `${address.street}${address.apartment ? `, ${address.apartment}` : ''}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  if (showAddForm) {
    return (
      <AddressForm
        onSave={handleAddAddress}
        onCancel={() => setShowAddForm(false)}
        title="Add New Address"
      />
    );
  }

  if (editingAddress) {
    return (
      <AddressForm
        address={editingAddress}
        onSave={handleUpdateAddress}
        onCancel={() => setEditingAddress(null)}
        title="Edit Address"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
        {showAddNew && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Add New</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedAddress?.id === address.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleAddressSelect(address)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {selectedAddress?.id === address.id ? (
                    <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{address.label}</span>
                    {address.isDefault && (
                      <span className="bg-gold-100 text-gold-800 text-xs font-medium px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm font-medium text-gray-700 mb-1">{address.name}</p>
                  <p className="text-sm text-gray-600 mb-1">{formatAddress(address)}</p>
                  {address.phone && (
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {!address.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(address.id);
                    }}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Set Default
                  </button>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingAddress(address);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(address.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600"
                  disabled={addresses.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
          <p className="text-gray-600 mb-4">Add your first delivery address to continue</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </button>
        </div>
      )}
    </div>
  );
}