const Card = ({ title, value }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
};

export default Card;
