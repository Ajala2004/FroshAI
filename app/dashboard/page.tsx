 'use client';

import { useEffect, useState, useRef } from 'react';
import Vapi from '@vapi-ai/web';

type Doctor = { name: string; specialty: string; avatar: string; assistantId: string };

const doctor: Doctor = {
  name: 'Dr. Frosh',
  specialty: 'Virtual Health Assistant',
  avatar: 'https://i.pravatar.cc/150?img=8',
  assistantId: process.env.NEXT_PUBLIC_ASSISTANT_ID   as string,
};

export default function Dashboard() {
  const [status, setStatus] = useState<'Idle' | 'Connecting' | 'Connected' | 'Disconnected'>('Idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState('00:00');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    const v = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY as string);
    vapiRef.current = v;

    v.on('call-start', () => {
      setStatus('Connected');
      const now = Date.now();
      setStartTime(now);
      timerRef.current = setInterval(() => {
        const diff = Date.now() - now;
        const m = String(Math.floor(diff / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        setDuration(`${m}:${s}`);
      }, 1000);
    });

    v.on('call-end', () => {
      setStatus('Disconnected');
      if (timerRef.current) clearInterval(timerRef.current);
    });

    v.on('message', (msg: any) => {
      if (msg.type === 'transcript') {
        setTranscripts((p) => [...p, `${msg.role}: ${msg.transcript}`]);
      }
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCall = () => {
    setStatus('Connecting');
    setTranscripts([]);
    vapiRef.current?.start(doctor.assistantId);
  };

  const endCall = () => {
    vapiRef.current?.stop();
    setStatus('Disconnected');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">My Dashboard</h1>
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <img src={doctor.avatar} alt={doctor.name} className="w-24 h-24 rounded-full border mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">{doctor.name}</h2>
          <p className="text-gray-500 mb-4">{doctor.specialty}</p>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className={`w-3 h-3 rounded-full ${
                status === 'Connected'
                  ? 'bg-green-500'
                  : status === 'Connecting'
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-gray-400'
              }`}
            />
            <span className="text-gray-700 font-medium">{status}</span>
          </div>

          {/* Action Buttons */}
          {status === 'Idle' && (
            <button
              onClick={startCall}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Start Call
            </button>
          )}
          {status === 'Connected' && (
            <button
              onClick={endCall}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              End Call
            </button>
          )}
        </div>

        {/* Call Duration */}
        {status === 'Connected' && (
          <div className="text-center mt-3 text-gray-500 font-mono">Duration: {duration}</div>
        )}

        {/* Transcript */}
        {status !== 'Idle' && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto space-y-3">
            {transcripts.length === 0 ? (
              <p className="text-gray-400 italic">No transcript yet...</p>
            ) : (
              transcripts.map((line, idx) => {
                const [role, ...text] = line.split(':');
                return (
                  <div key={idx} className="flex">
                    <span className="font-semibold text-blue-600 mr-1">{role}:</span>
                    <p className="text-gray-800">{text.join(':')}</p>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
