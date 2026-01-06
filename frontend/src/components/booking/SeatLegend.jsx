import { motion } from 'framer-motion';

const SeatLegend = () => {
  const legends = [
    { type: 'Available', class: 'seat-available', description: 'Click to select' },
    { type: 'Selected', class: 'seat-selected', description: 'Your selection' },
    { type: 'Booked', class: 'seat-booked', description: 'Not available' },
    { type: 'VIP', class: 'seat-available seat-vip', description: '1.5x price' },
    { type: 'Premium', class: 'seat-available seat-premium', description: '1.25x price' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap justify-center gap-6 p-4 glass-card"
    >
      {legends.map((legend) => (
        <div key={legend.type} className="flex items-center gap-2">
          <div className={`seat ${legend.class}`} style={{ width: 28, height: 28 }} />
          <div>
            <p className="text-white text-sm font-medium">{legend.type}</p>
            <p className="text-gray-400 text-xs">{legend.description}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default SeatLegend;
