import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Calendar } from "lucide-react";

const doctors = [
  { id: 1, name: "Dr. Sarah Rahman", specialty: "Cardiologist", experience: "15+", rating: 4.9, availableToday: true },
  { id: 2, name: "Dr. Ahmed Hossain", specialty: "General Physician", experience: "12+", rating: 4.8, availableToday: true },
  { id: 3, name: "Dr. Fatima Khan", specialty: "Gynecologist", experience: "18+", rating: 4.9, availableToday: false },
  { id: 4, name: "Dr. Karim Uddin", specialty: "Orthopedic", experience: "10+", rating: 4.7, availableToday: true },
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
              <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {doctor.name.split(' ')[1]?.[0] || doctor.name[0]}
                    </span>
                  </div>
                </div>
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
