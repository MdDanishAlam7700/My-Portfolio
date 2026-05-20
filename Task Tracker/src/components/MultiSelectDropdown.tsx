'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  sublabel?: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: Option[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MultiSelectDropdown = ({ 
  label, 
  options, 
  selectedIds, 
  onChange, 
  placeholder = 'Select options...',
  disabled = false
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedOptions = options.filter(opt => selectedIds.includes(opt.id));

  return (
    <div className="form-group" style={{ position: 'relative' }} ref={dropdownRef}>
      <label style={{
        display: 'block',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
        letterSpacing: '1.5px',
        fontWeight: 'bold'
      }}>
        {label}
      </label>
      
      <div 
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        style={{
          minHeight: '42px',
          background: 'var(--surface-mid)',
          border: isOpen ? '1px solid var(--neon-cyan)' : '1px solid var(--glass-border)',
          borderRadius: '4px',
          padding: '0.5rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
          transition: 'all 0.3s ease',
          boxShadow: isOpen ? '0 0 10px rgba(0,255,242,0.1)' : 'none'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxWidth: '90%' }}>
          {selectedOptions.length === 0 ? (
            <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{placeholder}</span>
          ) : (
              selectedOptions.map(opt => (
                <span key={opt.id} style={{
                  background: 'var(--glass-tint-cyan)',
                  border: '1px solid var(--neon-cyan)',
                  color: 'var(--neon-cyan)',
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  {opt.label}
                  <X 
                    size={10} 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(opt.id);
                    }} 
                    style={{ cursor: 'pointer' }}
                  />
                </span>
              ))
            )}
          </div>
          <ChevronDown size={16} style={{ 
            color: 'var(--text-dim)', 
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s ease'
          }} />
        </div>
  
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.5rem',
            background: 'var(--surface-high)',
            border: '1px solid var(--neon-cyan)',
            borderRadius: '4px',
            boxShadow: 'var(--glass-shadow)',
            zIndex: 1000,
            maxHeight: '220px',
            overflowY: 'auto',
            animation: 'slideIn 0.2s ease-out'
          }}>
            {options.map(opt => {
              const isSelected = selectedIds.includes(opt.id);
              return (
                <div 
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--surface-mid)' : 'transparent',
                    borderBottom: '1px solid var(--glass-border)',
                    transition: 'all 0.2s ease'
                  }}
                  className="dropdown-item"
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', color: isSelected ? 'var(--neon-cyan)' : 'var(--foreground)' }}>
                      {opt.label}
                    </div>
                    {opt.sublabel && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                        {opt.sublabel}
                      </div>
                    )}
                  </div>
                  {isSelected && <Check size={14} color="var(--neon-cyan)" />}
                </div>
              );
            })}
          </div>
        )}
  
        <style jsx>{`
          .dropdown-item:hover {
            background: var(--surface-low) !important;
          }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MultiSelectDropdown;
