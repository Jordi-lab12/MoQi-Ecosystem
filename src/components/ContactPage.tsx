import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage = ({ onBack }: ContactPageProps) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'email') {
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      } else {
        setPhoneCopied(true);
        setTimeout(() => setPhoneCopied(false), 2000);
      }
      toast({
        title: "Copied!",
        description: `${type === 'email' ? 'Email' : 'Phone number'} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 relative">
      {/* Logo in top left corner */}
      <div className="absolute top-4 left-4 z-10">
        <img 
          src="/lovable-uploads/70545324-72aa-4d39-9b13-d0f991dc6d19.png" 
          alt="MoQi Logo" 
          className="w-20 h-20"
        />
      </div>
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center justify-center flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Contact MoQi
            </h1>
          </div>
        </div>

        {/* Contact Information */}
        <Card className="shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img 
                src="/lovable-uploads/70545324-72aa-4d39-9b13-d0f991dc6d19.png" 
                alt="MoQi Logo" 
                className="w-24 h-24 mx-auto"
              />
            </div>
            <CardTitle className="text-2xl text-gray-800">Get in Touch</CardTitle>
            <p className="text-gray-600">We'd love to hear from you! Reach out using the information below.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Email</p>
                  <p className="text-gray-600">bram.heyselberghs@gmail.com</p>
                </div>
                <Button
                  onClick={() => copyToClipboard('bram.heyselberghs@gmail.com', 'email')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {emailCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Button
                onClick={() => window.open('mailto:bram.heyselberghs@gmail.com', '_blank')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Send Email
              </Button>
            </div>

            {/* Phone */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Phone</p>
                  <p className="text-gray-600">+32494372514</p>
                </div>
                <Button
                  onClick={() => copyToClipboard('+32494372514', 'phone')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {phoneCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Button
                onClick={() => window.open('tel:+32494372514', '_blank')}
                variant="outline"
                className="w-full border-green-200 hover:border-green-300 hover:bg-green-50 text-green-700"
              >
                Call Now
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
              <p className="text-sm text-gray-600 text-center">
                Have questions about MoQi? Want to suggest a startup? Or just want to say hello? 
                We're always excited to connect with our community!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};