import React from 'react';

export function render({ name }: { name: string }) {
    return (
        <div>
            <p>Hi, {name}!</p>
        </div>
    )
}