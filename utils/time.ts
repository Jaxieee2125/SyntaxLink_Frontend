/**
 * Trả về lời chào phù hợp (Sáng, Trưa, Chiều, Tối) dựa trên giờ hiện tại.
 * @returns {string} Lời chào.
 */
export const getGreeting = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return 'Chào buổi sáng';
  } else if (currentHour < 18) {
    return 'Chào buổi chiều';
  } else {
    return 'Chào buổi tối';
  }
};