import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../components/hooks/useTheme';
import { Edit2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import Breadcrumb from '@/components/seo/Breadcrumb';
import BookingLeftContent from '../components/booking/BookingLeftContent';
import BookingProgressIndicator from '../components/booking/BookingProgressIndicator';
import BookingTypeSelector from '../components/booking/BookingTypeSelector';
import BookingDateTimeSelector from '../components/booking/BookingDateTimeSelector';
import BookingFormFields from '../components/booking/BookingFormFields';
import BookingSuccessView from '../components/booking/BookingSuccessView';

export default function AgendarConsulta() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appointmentType, setAppointmentType] = useState('avaliacao');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  // Auto-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleTypeSelect = (type) => {
    setAppointmentType(type);
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await base44.functions.invoke('processAppointmentSubmission', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        appointmentType,
        selectedDate,
        selectedSlot
      });

      if (response.data.success) {
        setLoading(false);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Disparar evento para chat widget
        const event = new CustomEvent('appointmentCreated', {
          detail: { 
            appointmentId: response.data.appointmentId,
            clienteName: formData.name,
            clienteEmail: formData.email
          }
        });
        window.dispatchEvent(event);
        
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#10b981', '#0d9c6e', '#0a7d58'],
          disableForReducedMotion: true
        });
      } else {
        setLoading(false);
        alert(response.data.error || 'Erro ao processar agendamento.');
      }
    } catch (error) {
      console.error('Erro ao processar agendamento:', error);
      setLoading(false);
      alert('Erro ao processar agendamento. Tente novamente.');
    }
  };

  if (submitted) {
    return <BookingSuccessView selectedDate={selectedDate} selectedSlot={selectedSlot} theme={theme} />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={[
            { label: 'Painel', url: createPageUrl('MeuPainel') },
            { label: 'Agendar Consulta' }
          ]} />
          <div className="mt-4 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Agendar Consulta
            </h1>
            {user && (
              <a 
                href={createPageUrl('Profile')}
                className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:opacity-80 transition"
              >
                <Edit2 className="w-4 h-4" />
                Atualizar dados
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          <div className="hidden lg:block">
            <BookingLeftContent theme={theme} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)] p-4 md:p-6 shadow-lg"
          >
            <BookingProgressIndicator currentStep={step} theme={theme} />

            {step === 0 && (
              <BookingTypeSelector onSelect={handleTypeSelect} theme={theme} />
            )}

            {step === 1 && (
              <BookingDateTimeSelector
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onDateChange={setSelectedDate}
                onSlotChange={setSelectedSlot}
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
                appointmentType={appointmentType}
                theme={theme}
              />
            )}

            {step === 2 && (
              <BookingFormFields
                formData={formData}
                onChange={setFormData}
                onSubmit={handleSubmit}
                onBack={() => setStep(1)}
                loading={loading}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                appointmentType={appointmentType}
                theme={theme}
              />
            )}

            <p className="text-center text-xs mt-6 text-[var(--text-secondary)]">
              * Ao clicar em solicitar, você concorda com nossos termos de uso e política de privacidade. 
              Seus dados estão protegidos pela LGPD.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}