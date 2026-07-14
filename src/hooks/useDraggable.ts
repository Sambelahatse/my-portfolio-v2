import { useEffect, useRef, useState } from 'react';

interface Position {
    x: number;
    y: number;
}

interface UseDraggableOptions {
    disabled?: boolean;
    // On n'utilise plus 'handle' comme sélecteur string
}

/**
 * Hook personnalisé pour rendre un élément déplaçable (draggable)
 * Version ultra-fiable utilisant des refs explicites
 */
export const useDraggable = (options: UseDraggableOptions = {}) => {
    const { disabled = false } = options;

    // Position visuelle
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    // Refs
    const elementRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null); // Nouvelle ref pour le handle

    const positionRef = useRef<Position>({ x: 0, y: 0 });
    const dragStartRef = useRef<Position>({ x: 0, y: 0 });
    const startPositionRef = useRef<Position>({ x: 0, y: 0 });

    useEffect(() => {
        if (disabled) return;

        // Cible pour l'événement : le handle s'il existe, sinon l'élément entier
        const target = handleRef.current || elementRef.current;
        if (!target) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return;
            e.preventDefault();

            setIsDragging(true);

            dragStartRef.current = { x: e.clientX, y: e.clientY };
            startPositionRef.current = { ...positionRef.current };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'grabbing';
        };

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - dragStartRef.current.x;
            const deltaY = e.clientY - dragStartRef.current.y;

            const newX = startPositionRef.current.x + deltaX;
            const newY = startPositionRef.current.y + deltaY;

            positionRef.current = { x: newX, y: newY };
            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
        };

        target.addEventListener('mousedown', handleMouseDown);
        // Important pour le curseur 'grab' au survol
        target.style.cursor = 'grab';

        return () => {
            target.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            target.style.cursor = '';
            document.body.style.cursor = '';
        };
    }, [disabled]);

    // Reset si désactivé
    useEffect(() => {
        if (disabled) {
            setPosition({ x: 0, y: 0 });
            positionRef.current = { x: 0, y: 0 };
        }
    }, [disabled]);

    return {
        ref: elementRef,
        handleRef: handleRef, // On expose la ref du handle
        style: {
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            zIndex: 50,
            touchAction: 'none'
        },
        isDragging
    };
};
