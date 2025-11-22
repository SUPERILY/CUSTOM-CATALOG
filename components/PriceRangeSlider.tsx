import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface PriceRangeSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
    min,
    max,
    value,
    onChange,
}) => {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Price Range</label>
                <span className="text-sm text-gray-600">
                    ${value[0]} - ${value[1]}
                </span>
            </div>
            <Slider
                range
                min={min}
                max={max}
                value={value}
                onChange={(val) => onChange(val as [number, number])}
                trackStyle={[{ backgroundColor: '#4f46e5' }]}
                handleStyle={[
                    { borderColor: '#4f46e5', backgroundColor: '#fff' },
                    { borderColor: '#4f46e5', backgroundColor: '#fff' },
                ]}
                railStyle={{ backgroundColor: '#e5e7eb' }}
            />
        </div>
    );
};
