import React, { useState, useContext } from 'react';
import FormProgress from '../src/components/form/FormProgress';
import BrigadeInfoStep from '../src/components/form/BrigadeInfoStep';
import ClothingStep from '../src/components/form/ClothingStep';
import BootsStep from '../src/components/form/BootsStep';
import GlovesStep from '../src/components/form/GlovesStep';
import EppStep from '../src/components/form/EppStep';
import ToolsStep from '../src/components/form/ToolsStep';
import VehiclesStep from '../src/components/form/VehiclesStep';
import FoodStep from '../src/components/form/FoodStep';
import CampingStep from '../src/components/form/CampingStep';
import HygieneStep from '../src/components/form/HygieneStep';
import MedicineStep from '../src/components/form/MedicineStep';
import AnimalsStep from '../src/components/form/AnimalsStep';
import SummaryStep from '../src/components/form/SummaryStep';
import SuccessAnimation from '../src/ui/SuccessAnimation';
import { createBrigade } from '../services/brigadeService';
import { useNavigate } from 'react-router-dom';

const FormPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdBrigadeId, setCreatedBrigadeId] = useState(null);
  const navigate = useNavigate();
  const steps = 13;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmitForm = async (formData) => {
    setIsSubmitting(true);
    try {
      const brigadeId = await createBrigade(formData);
      setCreatedBrigadeId(brigadeId);
      setSubmitSuccess(true);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate(`/board`);
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
      // Manejar error
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1: return <BrigadeInfoStep onNext={nextStep} />;
      case 2: return <ClothingStep onNext={nextStep} onPrev={prevStep} />;
      case 3: return <BootsStep onNext={nextStep} onPrev={prevStep} />;
      case 4: return <GlovesStep onNext={nextStep} onPrev={prevStep} />;
      case 5: return <EppStep onNext={nextStep} onPrev={prevStep} />;
      // ... otros pasos
      case 13: return <SummaryStep onSubmit={handleSubmitForm} onPrev={prevStep} isSubmitting={isSubmitting} />;
      default: return <BrigadeInfoStep onNext={nextStep} />;
    }
  };

  return (
    <div className="form-page">
      <h1>Formulario de Necesidades de Bomberos</h1>
      
      <FormProgress currentStep={currentStep} steps={steps} />
      
      <div className="form-container">
        {submitSuccess ? (
          <SuccessAnimation />
        ) : (
          renderStep()
        )}
      </div>
    </div>
  );
};

export default FormPage;
