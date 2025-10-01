import { CountdownTimer } from "../countdown-timer";

export default function CountdownTimerExample() {
  const endTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
  
  return (
    <div className="p-6 space-y-4">
      <CountdownTimer endTime={endTime} />
      <CountdownTimer endTime={endTime} compact />
    </div>
  );
}
