import { GetStaticPaths, GetStaticProps } from 'next';
import '../../../app/globals.css';

interface VehicleModel {
  ModelName: string;
}

interface ResultProps {
  vehicleModels: VehicleModel[];
  makeId: string;
  year: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    { params: { makeID: '1', year: '2024' } },
    { params: { makeID: '2', year: '2023' } },
  ];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<ResultProps> = async (context) => {
  const { makeID, year } = context.params as { makeID: string; year: string };

  if (!makeID || !year) {
    return {
      notFound: true,
    };
  }

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeID}/modelyear/${year}?format=json`
    );
    const data = await res.json();

    const vehicleModels = data.Results || [];

    return {
      props: {
        vehicleModels,
        makeId: makeID,
        year,
      },
    };
  } catch (error) {
    console.error('Error fetching vehicle models:', error);
    return {
      props: {
        vehicleModels: [],
        makeId: makeID,
        year,
      },
    };
  }
};

const ResultPage: React.FC<ResultProps> = ({ vehicleModels, makeId, year }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-8">
        <h1 className="text-4xl font-semibold text-gray-800 text-center mb-6">
          Vehicle Models
        </h1>
        <div className="mb-6 text-center">
          <p className="text-lg text-gray-600">
            <span className="font-medium">Make ID:</span> {makeId}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-medium">Model Year:</span> {year}
          </p>
        </div>
        <div className="w-full">
          {vehicleModels.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {vehicleModels.map((model, index) => (
                <li
                  key={index}
                  className="p-4 border border-gray-300 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {model.ModelName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No models found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
