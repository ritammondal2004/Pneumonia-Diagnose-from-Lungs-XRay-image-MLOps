/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Network, Image as ImageIcon, Activity, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModelDetails() {
  const cards = [
    {
      title: 'Architecture',
      value: 'Residual CNN (RobustXrayNet)',
      description: 'Contains an initial convolution layer, three residual blocks with skip connections, batch normalization, global average pooling, dropout, and a fully connected classifier.',
      icon: Network,
    },
    {
      title: 'Input Processing',
      value: '224 × 224 RGB Chest X-ray',
      description: 'Images are processed through a standard TorchVision preprocessing pipeline before being fed into the neural network.',
      icon: ImageIcon,
    },
    {
      title: 'Prediction & Output',
      value: 'Binary Classification',
      description: 'The model outputs a prediction of Normal or Pneumonia, accompanied by a calibrated confidence score.',
      icon: Activity,
    },
    {
      title: 'Training Dataset',
      value: '5,856 Pediatric X-rays',
      description: 'Trained end-to-end on a comprehensive dataset of labeled pediatric chest radiographs to learn clinically relevant lung patterns.',
      icon: Database,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="model-details" className="py-24 bg-gradient-to-b from-white to-blue-50/30 relative overflow-hidden border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 max-w-3xl"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            RobustXrayNet, tuned for <span className="text-blue-500">pneumonia signals.</span>
          </h2>
          <p className="text-slate-500 mt-6 text-lg md:text-xl leading-relaxed">
            Our custom residual convolutional neural network learns clinically relevant lung patterns from pediatric chest X-ray images to assist in fast pneumonia screening.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                variants={itemVariants}
                key={idx}
                className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-500 border border-slate-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8">
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="mb-3">
                  <span className="text-sm font-bold font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    {card.title}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {card.value}
                  </h3>
                </div>
                <p className="text-slate-500 text-base leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
