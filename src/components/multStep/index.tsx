interface MultStepProps {
  size: number;
  currentStep: number;
}

export function MultStap({ size, currentStep }: MultStepProps) {
  return (
    <div className="px-2 mb-5">
      <label className="text-gray-300 mb-2 flex">
        Passo {currentStep ? currentStep : "1"} de {size}
      </label>

      <div className="flex gap-2">
        {Array.from({ length: size }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`w-1/4 h-1 ${
              currentStep >= step ? "bg-gray-200" : "bg-gray-600"
            } rounded-sm`}
          ></div>
        ))}
      </div>
    </div>
  );
}
