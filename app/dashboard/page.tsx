'use client';

import { useEffect, useState, useRef } from 'react';
import Vapi from '@vapi-ai/web';

type Doctor = { name: string; specialty: string; avatar: string; assistantId: string };
const doctor: Doctor = { name: 'Dr. Frosh', specialty: 'Virtual Health Assistant',
   avatar: 'https://i.pravatar.cc/150?img=8', assistantId: process.env.NEXT_PUBLIC_ASSISTANT_ID  as string };

export default function Dashboard() {
  const [status, setStatus] = useState<'Idle' | 'Connecting' | 'Connected' | 'Disconnected'>('Idle');
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [duration, setDuration] = useState('00:00');
  const timer = useRef<NodeJS.Timeout | null>(null);
  const vapiRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const v = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY as string);
    vapiRef.current = v;

    v.on('call-start', () => {
      setStatus('Connected');
      startTimeRef.current = Date.now();
      timer.current = setInterval(() => {
        const diff = Date.now() - startTimeRef.current;
        setDuration(`${String(Math.floor(diff / 60000)).padStart(2,'0')}:${String(Math.floor((diff % 60000)/1000)).padStart(2,'0')}`);
      }, 1000);
    });

    v.on('call-end', () => setStatus('Disconnected'));
    v.on('message', (msg:any) => msg.type==='transcript' && setTranscripts((p)=>[...p, `${msg.role}: ${msg.transcript}`]));
    v.on('error', () => setStatus('Disconnected'));

    return () => clearInterval(timer.current!);
  }, []);

  const startCall = () => {
    setStatus('Connecting');
    setTranscripts([]);
    vapiRef.current?.start(doctor.assistantId);
  };

  const endCall = () => {
    if (status === 'Connected') vapiRef.current?.stop();
  };

  const reconnect = () => startCall();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">My Dashboard</h1>

      <div className="bg-white shadow rounded-xl p-8 w-full max-w-md space-y-5">
        <div className="flex flex-col items-center text-center space-y-2">
          <img src={doctor.avatar} alt="" className="w-24 h-24 rounded-full border" />
          <h2 className="text-2xl font-semibold">{doctor.name}</h2>
          <p className="text-gray-500">{doctor.specialty}</p>
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${status==='Connected'?'bg-green-500':status==='Connecting'?'bg-yellow-500 animate-pulse':'bg-gray-400'}`}></span>
            <span className="text-gray-700 font-medium">{status}</span>
          </div>
        </div>

        <div className="space-y-3">
          {status==='Idle' && <button onClick={startCall} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Start Call</button>}
          {status==='Connecting' && <button disabled className="w-full bg-yellow-400 text-white py-2 rounded cursor-wait">Connecting…</button>}
          {status==='Connected' && <button onClick={endCall} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">End Call</button>}
          {status==='Disconnected' && <button onClick={reconnect} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Reconnect</button>}
        </div>

        {status==='Connected' && <div className="text-center text-gray-600 font-mono">⏱ {duration}</div>}

        {(status!=='Idle') && (
          <div className="max-h-64 overflow-y-auto bg-gray-100 p-4 rounded text-sm space-y-2">
            {transcripts.length===0 ? <p className="text-gray-400 italic text-center">No transcript yet...</p> : transcripts.map((line,i)=>(
              <div key={i} className="flex"><span className="font-semibold text-blue-600">{line.split(':')[0]}:</span><span className="ml-1">{line.split(':').slice(1).join(':')}</span></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
