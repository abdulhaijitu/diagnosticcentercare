import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rashida Begum",
    location: "Mohammadpur, Dhaka",
    rating: 5,
    text: "The home sample collection service was incredibly convenient. The staff was professional and my reports were ready the next day. Highly recommended!",
    service: "Home Sample Collection",
  },
  {
    id: 2,
    name: "Kamrul Islam",
    location: "Mirpur, Dhaka",
    rating: 5,
    text: "Dr. Rahman provided excellent care during my consultation. The diagnostic tests were accurate and helped identify my condition quickly.",
    service: "Doctor Consultation",
  },
  {
    id: 3,
    name: "Nasreen Akter",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    text: "Very impressed with the cleanliness and organization of the center. The staff is friendly and the reports are always on time. Best diagnostic center!",
    service: "Diagnostic Tests",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-4">
            Patient Stories
          </span>
          <h2 className="text-display-sm md:text-display-md font-bold mb-4">
            What Our Patients Say
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Real experiences from patients who trusted us with their healthcare needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10"
            >
              {/* Quote icon */}
              <Quote className="h-10 w-10 text-care-amber mb-4 opacity-50" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-care-amber text-care-amber" />
                ))}
              </div>

              {/* Text */}
              <p className="text-primary-foreground/90 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-primary-foreground/70">{testimonial.location}</p>
                </div>
              </div>

              {/* Service badge */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-xs text-care-amber font-medium">
                  {testimonial.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
