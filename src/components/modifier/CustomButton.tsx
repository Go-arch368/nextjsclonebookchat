// components/modifier/CustomButton.tsx
interface CustomButtonProps {
  text: string;
  bgColor: string;
  icon?: React.ReactNode;
  isVisible: boolean;
}

export default function CustomButton({ text, bgColor, icon, isVisible }: CustomButtonProps) {
  if (!isVisible) return null;
  return (
    <li>
      <button
        className="w-full flex justify-center items-center px-4 py-2 text-white rounded-md transition text-sm break-words max-w-full"
        style={{ backgroundColor: bgColor }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {text}
      </button>
    </li>
  );
}