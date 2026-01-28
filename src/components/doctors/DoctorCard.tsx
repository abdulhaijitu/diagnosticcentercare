import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Clock, 
  GraduationCap, 
  MapPin, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export interface DoctorCardProps {
  id: string | number;
  name: string;
  specialty: string;
  specialtyName: string;
  qualification: string;
  experience: number;
  rating: number;
  reviews: number;
  fee: number;
  image: string;
  availability: string[];
  nextSlot: string;
  languages: string[];
  hospital: string;
  isFromDb?: boolean;
  dbId?: string;
}

interface Props {
  doctor: DoctorCardProps;
  onBookAppointment?: (doctor: DoctorCardProps) => void;
}

export function DoctorCard({ doctor, onBookAppointment }: Props) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (doctor.isFromDb && doctor.dbId) {
      navigate(`/doctors/${doctor.dbId}`);
    }
  };

  const handleBookAppointment = () => {
    if (onBookAppointment) {
      onBookAppointment(doctor);
    } else if (doctor.isFromDb && doctor.dbId) {
      navigate(`/book-appointment?doctor=${doctor.dbId}`);
    } else {
      navigate("/book-appointment");
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-shadow">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Doctor Image */}
        <div className="flex-shrink-0">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-32 h-32 rounded-2xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={handleViewProfile}
          />
        </div>

        {/* Doctor Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
            <div>
              <h3 
                className="text-xl font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                onClick={handleViewProfile}
              >
                {doctor.name}
              </h3>
              <p className="text-primary font-medium">{doctor.specialtyName}</p>
            </div>
            <div className="flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-full">
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span className="font-semibold text-accent">{doctor.rating}</span>
              <span className="text-muted-foreground text-sm">({doctor.reviews})</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              <span>{doctor.qualification}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{doctor.experience} years exp.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{doctor.hospital}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {doctor.availability.slice(0, 4).map((day) => (
              <Badge key={day} variant="outline" className="text-xs">
                {day}
              </Badge>
            ))}
            {doctor.availability.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{doctor.availability.length - 4} more
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Consultation Fee</p>
                <p className="text-xl font-bold text-foreground">৳{doctor.fee}</p>
              </div>
              <div className="pl-4 border-l border-border">
                <p className="text-sm text-muted-foreground">Next Available</p>
                <p className="text-sm font-medium text-success flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {doctor.nextSlot}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {doctor.isFromDb && doctor.dbId && (
                <Button variant="outline" onClick={handleViewProfile}>
                  View Profile
                </Button>
              )}
              <Button onClick={handleBookAppointment}>
                Book Now
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
