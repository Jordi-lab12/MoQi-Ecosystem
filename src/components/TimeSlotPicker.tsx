import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

export const TimeSlotPicker = ({ selectedDate, selectedTime, onTimeChange }: TimeSlotPickerProps) => {
  // Generate 30-minute intervals from 9:00 AM to 9:00 PM
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 21 && minute === 30) break; // Stop at 9:00 PM
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatTimeDisplay = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div>
      <Label htmlFor="time">Select Time</Label>
      <Select value={selectedTime} onValueChange={onTimeChange}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Choose a time slot" />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {timeSlots.map((slot) => (
            <SelectItem key={slot} value={slot}>
              {formatTimeDisplay(slot)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};