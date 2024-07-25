import { FiTrash } from "react-icons/fi";
import { useTranslations } from "next-intl";



export function DeleteButton({
  onClick,
  disabled,
}: {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  disabled?: boolean;
  
}) {
  const transWelcome = useTranslations("general");
  return (
    <div
      className={`
        my-auto 
        flex 
        mb-1 
        ${disabled ? "cursor-default" : "hover:bg-hover cursor-pointer"} 
        w-fit 
        p-2 
        rounded-lg
        border-border
        text-sm`}
      onClick={onClick}
    >
      <FiTrash className="mr-1 my-auto" />
      {transWelcome("delete")}
    </div>
  );
}
