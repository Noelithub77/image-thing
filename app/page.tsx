import ImageResizer from './components/ImageResizer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Image Resizer
        </h1>
        <ImageResizer targetWidth={1200} targetHeight={900} />
      </div>
    </main>
  );
}