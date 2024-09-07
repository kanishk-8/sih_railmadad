import TrainComplaintsTable from '@/components/admin/TrainComplaintsTable';
import StationComplaintsTable from '@/components/admin/StationComplaintsTable';

const ComplaintsPage = () => {
  return (
    <div>
      <TrainComplaintsTable />
      <StationComplaintsTable />
    </div>
  );
};

export default ComplaintsPage;
