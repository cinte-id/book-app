import { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  BookmarkCheck, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp,
  Sparkles,
  Target,
  Users,
  Clock,
  Star,
  HelpCircle,
  Mail,
  MessageSquare
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import HelpfulSurvey from '../components/support/HelpfulSurvey';

const UserGuide = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: 'Temukan Buku Favorit',
      shortTitle: 'Temukan Buku',
      icon: Search,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      desc: 'Gunakan kolom pencarian di halaman utama atau filter kategori untuk menemukan buku berdasarkan judul, penulis, maupun genre favorit Anda. Sistem kami menyediakan katalog ribuan buku dari berbagai genre.',
      tip: 'Tips: Manfaatkan tab "Rekomendasi Trending" di halaman Home untuk melihat buku paling populer minggu ini.',
      details: [
        { icon: Search, text: 'Cari buku berdasarkan judul, penulis, atau genre' },
        { icon: Target, text: 'Filter berdasarkan kategori: Fiction, Non-Fiction, Sci-Fi, dll' },
        { icon: Sparkles, text: 'Lihat rekomendasi personal berdasarkan riwayat baca Anda' },
        { icon: Star, text: 'Sortir berdasarkan rating, terbaru, atau paling populer' },
      ],
    },
    {
      id: 2,
      title: 'Pinjam & Simpan Koleksi',
      shortTitle: 'Pinjam Buku',
      icon: BookOpen,
      color: 'amber',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      desc: 'Klik tombol "Pinjam" atau "Read" pada kartu buku. Buku akan otomatis masuk rak "Currently Reading" Anda. Anda juga bisa menyimpan buku ke "Want to Read" untuk dibaca nanti.',
      tip: 'Tips: Masa peminjaman standar berlaku selama 14 hari. Anda dapat memperpanjang hingga 2 kali sebelum jatuh tempo.',
      details: [
        { icon: BookOpen, text: 'Klik "Read" untuk memulai membaca buku langsung' },
        { icon: BookmarkCheck, text: 'Klik "Want to Read" untuk simpan ke daftar bacaan nanti' },
        { icon: Clock, text: 'Durasi pinjam: 14 hari (dapat diperpanjang 2x @ 7 hari)' },
        { icon: Users, text: 'Maksimal 5 buku dipinjam bersamaan' },
      ],
    },
    {
      id: 3,
      title: 'Pantau Progres Membaca',
      shortTitle: 'Pantau Progres',
      icon: BookmarkCheck,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      desc: 'Perbarui halaman yang telah Anda baca secara berkala pada menu Reading Stats untuk melihat kemajuan membaca Anda. Lacak streak harian, total halaman, dan capai target bulanan.',
      tip: 'Tips: Menyelesaikan target mingguan akan meningkatkan statistik profil dan membuka achievement khusus.',
      details: [
        { icon: TrendingUp, text: 'Update halaman baca dengan slider atau input manual' },
        { icon: Target, text: 'Set target harian/mingguan/bulanan halaman yang ingin dibaca' },
        { icon: Clock, text: 'Lihat streak membaca harian Anda (beruntun tanpa putus)' },
        { icon: Users, text: 'Bandingkan statistik dengan teman atau komunitas' },
      ],
    },
  ];

  const currentStep = steps[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100 mb-4"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mb-3 shadow-lg shadow-amber-200">
              <BookOpen size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panduan Penggunaan
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Pelajari langkah mudah memulai pengalaman membaca Anda di BookTracker
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = activeStep === index;
              const isCompleted = activeStep > index;
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1 relative">
                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-1.5 z-0 transform translate-x-1/2" style={{ marginLeft: '-50%' }}>
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-amber-500' : 'bg-gray-200'
                        }`}
                        style={{ width: isCompleted ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                  
                  {/* Step Circle */}
                  <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    isActive 
                      ? `bg-${step.color}-600 shadow-lg shadow-${step.color}-300 scale-110`
                      : isCompleted 
                        ? 'bg-green-500 shadow-md shadow-green-300'
                        : 'bg-gray-200'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle size={20} className="text-white" />
                    ) : (
                      <step.icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium transition-colors ${
                      isActive ? `text-${step.color}-600` : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      Langkah {step.id}
                    </p>
                    <p className={`text-xs font-semibold transition-colors ${
                      isActive ? `text-${step.color}-600` : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.shortTitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step Card */}
          <Card className={`${currentStep.borderColor} shadow-lg overflow-hidden transition-all duration-300`}>
            <CardHeader className={`${currentStep.bgColor} px-6 py-5 border-b ${currentStep.borderColor}`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${currentStep.iconBg}`}>
                  <currentStep.icon size={28} className={currentStep.iconColor} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentStep.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Langkah {activeStep + 1} dari {steps.length}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                {currentStep.desc}
              </p>

              {/* Details List */}
              <div className="space-y-3 mb-6">
                {currentStep.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${currentStep.iconBg}`}>
                      <detail.icon size={18} className={currentStep.iconColor} />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mt-0.5">
                      {detail.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tip Box */}
              <div className={`${currentStep.bgColor} border-l-4 ${currentStep.borderColor.replace('border-', 'border-l-')} p-4 rounded-r-lg`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep.iconBg}`}>
                    <Sparkles size={18} className={currentStep.iconColor} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${currentStep.color}-900`}>Tips Pro</p>
                    <p className={`text-sm ${currentStep.color}-800 mt-1`}>
                      {currentStep.tip}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access to Other Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Link
              to="/help"
              className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all text-center group"
            >
              <HelpCircle size={24} className="text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Pusat Bantuan FAQ</p>
              <p className="text-xs text-gray-500 mt-1">Cari jawaban cepat</p>
            </Link>
            
            <Link
              to="/contact"
              className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-amber-300 transition-all text-center group"
            >
              <Mail size={24} className="text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Hubungi Support</p>
              <p className="text-xs text-gray-500 mt-1">Buat tiket bantuan</p>
            </Link>
            
            <Link
              to="/feedback"
              className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-purple-300 transition-all text-center group"
            >
              <MessageSquare size={24} className="text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-900">Berikan Saran</p>
              <p className="text-xs text-gray-500 mt-1">Kritik & saran fitur</p>
            </Link>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <Button
              onClick={handlePrev}
              disabled={activeStep === 0}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft size={18} />
              <span>Sebelumnya</span>
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{activeStep + 1}</span>
              <span className="text-gray-300">/</span>
              <span>{steps.length}</span>
            </div>

            {isLastStep ? (
              <Button
                onClick={() => navigate('/')}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2 shadow-md hover:shadow-lg"
              >
                <CheckCircle size={18} />
                <span>Mulai Membaca!</span>
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className={`bg-${currentStep.color}-600 hover:bg-${currentStep.color}-700 text-white gap-2 shadow-md hover:shadow-lg`}
              >
                <span>Langkah Selanjutnya</span>
                <ArrowRight size={18} />
              </Button>
            )}
          </div>
          <div className="pt-2">
            <HelpfulSurvey topic="user-guide" question="Apakah panduan ini mudah diikuti?" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;