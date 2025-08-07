 'use client';

import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

type Doctor = {
  name: string;
  specialty: string;
  avatar: string;
  assistantId: string;
};

const doctor: Doctor = {
  name: 'Doc Frosh',
  specialty: 'Virtual AI Specialist',
  avatar: 'https://i.pravatar.cc/150?img=12',
  assistantId: process.env.NEXT_PUBLIC_ASSISTANT_ID as string,
};

export default function Dashboard() {
  const [status, setStatus] = useState<'Connected' | 'Disconnected' | ''>('');
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState('00:00');
  const [isCalling, setIsCalling] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    const v = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY as string);
    vapiRef.current = v;

    v.on('call-start', () => {
      setStatus('Connected');
      setStartTime(Date.now());
      setIsCalling(true);

      timerRef.current = setInterval(() => {
        const now = Date.now();
        const diff = now - (startTime || now);
        const mins = String(Math.floor(diff / 60000)).padStart(2, '0');
        const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        setDuration(`${mins}:${secs}`);
      }, 1000);
    });

    v.on('call-end', () => {
      setStatus('Disconnected');
      setIsCalling(false);
      if (timerRef.current) clearInterval(timerRef.current);
    });

    v.on('message', (msg: any) => {
      if (msg.type === 'transcript') {
        setTranscripts((prev) => [...prev, `${msg.role}: ${msg.transcript}`]);
      }
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime]);

  const startCall = () => {
    setTranscripts([]);
    setStatus('');
    setDuration('00:00');
    vapiRef.current?.start(doctor.assistantId);
  };

  const endCall = () => {
    vapiRef.current?.stop();
    setStatus('Disconnected');
    setIsCalling(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 via-pink-100 to-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">My Dashboard</h1>

      {/* Doctor Card */}
      <div className="max-w-md mx-auto bg-white shadow-2xl rounded-xl p-6 flex flex-col items-center space-y-4">
        <img
          src={doctor.avatar}
          alt={doctor.name}
          className="w-24 h-24 rounded-full border-4 border-indigo-300 shadow"
        />
        <h2 className="text-2xl font-bold text-indigo-800">{doctor.name}</h2>
        <p className="text-gray-600">{doctor.specialty}</p>

        {!isCalling ? (
          <button
            onClick={startCall}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
          >
            Start Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
          >
            End Call
          </button>
        )}
      </div>

      {/* Call Info & Transcript */}
      {isCalling && (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  status === 'Connected' ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
              <span className="text-gray-800 font-medium">{status}</span>
            </div>
            {status === 'Connected' && (
              <span className="text-sm text-gray-500">Duration: {duration}</span>
            )}
          </div>

          <div className="bg-gray-100 max-h-64 overflow-y-auto p-4 rounded text-sm">
            {transcripts.length === 0 ? (
              <p className="text-gray-400 italic">Transcripts will appear here...</p>
            ) : (
              transcripts.map((line, i) => (
                <p key={i} className="mb-1 text-gray-700">
                  {line}
                </p>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
