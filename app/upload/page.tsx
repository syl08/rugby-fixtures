import UploadFixtureForm from '../components/UploadFixtureForm';

export default function Page() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Upload Fixtures</h1>
            <UploadFixtureForm />
        </div>
    );
}
