interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <hr className="my-4 border-gray-200" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5">
        {children}
      </div>
    </div>
  );
};

export default FormSection;