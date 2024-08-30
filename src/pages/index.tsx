import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../app/globals.css';

const HomePage = () => {
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const vehicleResponse = await fetch(
          'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
        );
        if (!vehicleResponse.ok)
          throw new Error('Failed to fetch vehicle types');
        const vehicleData = await vehicleResponse.json();
        setVehicleTypes(vehicleData.Results.map((type: any) => type.MakeName));

        const currentYear = new Date().getFullYear();
        setYears(
          Array.from(
            { length: currentYear - 2015 + 1 },
            (_, i) => currentYear - i
          )
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, []);

  const isNextButtonEnabled = selectedVehicleType && selectedYear;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Filter Vehicles
        </h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Vehicle Type
                <select
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={selectedVehicleType || ''}
                  onChange={(e) => setSelectedVehicleType(e.target.value)}
                >
                  <option value="">Select a vehicle type</option>
                  {vehicleTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Model Year
                <select
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={selectedYear || ''}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  <option value="">Select a model year</option>
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-center">
              <Link
                href={`/result/${encodeURIComponent(
                  selectedVehicleType || ''
                )}/${selectedYear}`}
                passHref
              >
                <button
                  className={`px-4 py-2 font-semibold text-white rounded-md transition-colors ${
                    isNextButtonEnabled
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isNextButtonEnabled}
                >
                  Next
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
