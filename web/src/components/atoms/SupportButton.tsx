import React, { useEffect, useRef } from 'react';

const SupportButton: React.FC = () => {
    const buttonRef = useRef<HTMLDivElement>(null);  // div要素を参照するためのref

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.async = true;
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'lodgefabq');
    script.setAttribute('data-color', '#454545');
    if (buttonRef.current) {
        buttonRef.current.appendChild(script);
    }
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.async = true;
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'lodgefabq');
    script.setAttribute('data-color', '#454545');
    script.setAttribute('data-emoji', '☕');
    script.setAttribute('data-font', 'Lato');
    script.setAttribute('data-text', '開発を支援する');
    script.setAttribute('data-outline-color', '#ffffff');
    script.setAttribute('data-font-color', '#ffffff');
    script.setAttribute('data-coffee-color', '#FFDD00');

    buttonRef.current?.appendChild(script);

    return () => {
        buttonRef.current?.removeChild(script);
      };
  }, []);

  return <div ref={buttonRef} />;  // ここで div をレンダリングして、それに ref を設定
};

export default SupportButton;
