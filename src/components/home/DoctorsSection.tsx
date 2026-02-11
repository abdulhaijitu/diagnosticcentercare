import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Calendar } from "lucide-react";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctor4 from "@/assets/doctor-4.jpg";

const doctors = [
  { id: 1, name: "Dr. Sarah Rahman", specialty: "Cardiologist", experience: "15+", rating: 4.9, availableToday: true, image: doctor1 },
  { id: 2, name: "Dr. Ahmed Hossain", specialty: "General Physician", experience: "12+", rating: 4.8, availableToday: true, image: doctor2 },
  { id: 3, name: "Dr. Fatima Khan", specialty: "Gynecologist", experience: "18+", rating: 4.9, availableToday: false, image: doctor3 },
  { id: 4, name: "Dr. Karim Uddin", specialty: "Orthopedic", experience: "10+", rating: 4.7, availableToday: true, image: doctor4 },
];

export function DoctorsSection() {
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              {t("doctorsSection.badge")}
            </span>
            <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              {t("doctorsSection.title")}
            </h2>
            <p className="text-muted-foreground text-lg">{t("doctorsSection.subtitle")}</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/doctors">
              {t("doctorsSection.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 ease-out hover:-translate-y-1">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {doctor.availableToday && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-success text-white text-xs font-medium">
                    {t("doctorsSection.availableToday")}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-foreground text-lg mb-1">{doctor.name}</h3>
                <p className="text-primary font-medium text-sm mb-2">{doctor.specialty}</p>
                <p className="text-muted-foreground text-sm mb-4">
                  {doctor.experience} {t("doctorsSection.experience")}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-care-amber text-care-amber" />
                    <span className="font-semibold text-sm">{doctor.rating}</span>
                  </div>
                  <Button size="sm" variant="secondary" asChild>
                    <Link to="/book-appointment">
                      <Calendar className="h-4 w-4" />
                      {t("doctorsSection.book")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
