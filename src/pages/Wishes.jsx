import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import Marquee from '@/components/ui/marquee';
import { Calendar, Clock, ChevronDown, User, MessageCircle, Send, Smile, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { formatEventDate } from '@/lib/formatEventDate';

export default function Wishes() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [newWish, setNewWish] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendance, setAttendance] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [wishes, setWishes] = useState([]);

  const options = [
    { value: 'ATTENDING', label: 'Ya, saya akan hadir' },
    { value: 'NOT_ATTENDING', label: 'Tidak, saya tidak bisa hadir' },
    { value: 'MAYBE', label: 'Mungkin, saya akan konfirmasi nanti' },
  ];

  useEffect(() => {
    const fetchWishes = async () => {
      const { data, error } = await supabase.from('wishes').select('*').order('timestamp', { ascending: false });
      if (!error) setWishes(data);
    };
    fetchWishes();
  }, []);

  const handleSubmitWish = async (e) => {
    e.preventDefault();
    if (!newWish.trim() || !name.trim() || !attendance) return;

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from('wishes')
      .insert([
        {
          name,
          message: newWish,
          attending: attendance.toLowerCase(),
          timestamp: new Date().toISOString(),
        },
      ])
      .select();

    console.log('INSERT result:', { data, error }); // Debugging

    if (!error && data && data.length > 0) {
      setWishes((prev) => [data[0], ...prev]);
      setNewWish('');
      setName('');
      setAttendance('');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    setIsSubmitting(false);
  };

  const getAttendanceIcon = (status) => {
    switch (status) {
      case 'attending':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'not-attending':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'maybe':
        return <HelpCircle className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <section id="wishes" className="min-h-screen relative overflow-hidden">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center space-y-4 mb-16">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-block text-rose-500 font-medium">
            Kirimkan Doa dan Harapan Terbaik Anda
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-5xl font-serif text-gray-800">
            Pesan dan Doa
          </motion.h2>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-center gap-4 pt-4">
            <div className="h-[1px] w-12 bg-rose-200" />
            <MessageCircle className="w-5 h-5 text-rose-400" />
            <div className="h-[1px] w-12 bg-rose-200" />
          </motion.div>
        </motion.div>

        {/* Wishes List */}
        <div className="max-w-2xl mx-auto space-y-6">
          <AnimatePresence>
            <Marquee speed={20} gradient={false} className="[--duration:20s] py-2">
              {wishes &&
                wishes.length > 0 &&
                wishes.map((wish, index) => (
                  <motion.div key={wish.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.1 }} className="group relative w-[280px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 to-pink-100/50 rounded-xl transform transition-transform group-hover:scale-[1.02] duration-300" />
                    <div className="relative backdrop-blur-sm bg-white/80 p-4 rounded-xl border border-rose-100/50 shadow-md">
                      <div className="flex items-start space-x-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center text-white text-sm font-medium">
                          {wish.name && wish.name.length > 0 ? wish.name[0].toUpperCase() : '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-800 text-sm truncate">{wish.name}</h4>
                            {getAttendanceIcon(wish.attending)}
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500 text-xs">
                            <Clock className="w-3 h-3" />
                            <time className="truncate">{formatEventDate(wish.timestamp)}</time>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-2 line-clamp-3">{wish.message}</p>
                      {Date.now() - new Date(wish.timestamp).getTime() < 3600000 && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-medium">New</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
            </Marquee>
          </AnimatePresence>
        </div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-2xl mx-auto mt-12">
          <form onSubmit={handleSubmitWish} className="relative">
            <div className="backdrop-blur-sm bg-white/80 p-6 rounded-2xl border border-rose-100/50 shadow-lg space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                  <User className="w-4 h-4" />
                  <span>Nama Kamu</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukan nama kamu..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-rose-100 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 text-gray-700 placeholder-gray-400"
                  required
                />
              </div>

              <div className="relative">
                <label className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Apakah kamu hadir?</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-rose-100 focus:border-rose-300 focus:ring focus:ring-rose-200 text-left flex justify-between items-center"
                >
                  <span className={attendance ? 'text-gray-700' : 'text-gray-400'}>{attendance ? options.find((o) => o.value === attendance)?.label : 'Pilih kehadiran...'}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-10 w-full mt-2 bg-white border border-rose-100 rounded-xl shadow-md overflow-hidden">
                      {options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setAttendance(option.value);
                            setIsOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-rose-50 text-sm text-gray-700"
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                  <Smile className="w-4 h-4" />
                  <span>Pesan / Doa</span>
                </label>
                <textarea
                  value={newWish}
                  onChange={(e) => setNewWish(e.target.value)}
                  placeholder="Tulis pesan atau doa kamu..."
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-rose-100 focus:border-rose-300 focus:ring focus:ring-rose-200 text-gray-700 placeholder-gray-400"
                  rows={4}
                  required
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition duration-200 flex items-center justify-center space-x-2">
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
