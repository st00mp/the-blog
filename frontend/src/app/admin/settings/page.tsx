"use client";

import React, { useRef } from "react";
import { Save, Upload, KeyRound, Bell, Settings } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/route-guard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Schémas Zod pour la validation des formulaires
const profileSchema = z.object({
    name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    email: z.string().email({ message: "Adresse e-mail invalide" }),
    avatar: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Veuillez entrer votre mot de passe actuel" }),
    newPassword: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    confirmPassword: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

const blogSettingsSchema = z.object({
    enableComments: z.boolean(),
    requireModeration: z.boolean(),
});

// Types dérivés des schémas Zod
type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type BlogSettingsFormValues = z.infer<typeof blogSettingsSchema>;

// Type pour les notifications
type NotificationSetting = {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
};

export default function SettingsPage() {
    // Utiliser le contexte d'authentification pour obtenir les informations de l'utilisateur
    const { user } = useAuth();

    // Référence pour l'input de fichier caché
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Formulaire de profil
    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "Jean Dupont",
            email: "jean.dupont@example.com",
            avatar: "",
        },
    });

    // Formulaire de mot de passe
    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    // Formulaire des paramètres du blog
    const blogSettingsForm = useForm<BlogSettingsFormValues>({
        resolver: zodResolver(blogSettingsSchema),
        defaultValues: {
            enableComments: true,
            requireModeration: true,
        },
    });

    // Notifications
    const [notifications, setNotifications] = React.useState<NotificationSetting[]>([
        {
            id: "new-comment",
            name: "Commentaires",
            description: "Recevoir une notification lorsqu'un commentaire est ajouté sur vos articles",
            enabled: true,
        },
        {
            id: "article-published",
            name: "Publication d'articles",
            description: "Recevoir une notification lorsqu'un article est publié",
            enabled: true,
        },
    ]);

    // Gérer le changement des notifications
    const toggleNotification = (id: string) => {
        setNotifications(
            notifications.map((notification) =>
                notification.id === id
                    ? { ...notification, enabled: !notification.enabled }
                    : notification
            )
        );
    };

    // Gestion du changement d'avatar
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Ici, vous pourriez implémenter un téléchargement de fichier réel
            // Pour cet exemple, je simule juste un changement d'avatar
            toast.success("Photo de profil mise à jour");
        }
    };

    // Soumission du formulaire de profil
    const onProfileSubmit = (data: ProfileFormValues) => {
        // Ici, vous implémenteriez la mise à jour du profil via une API
        toast.success("Profil mis à jour avec succès");
    };

    // Soumission du formulaire de mot de passe
    const onPasswordSubmit = (data: PasswordFormValues) => {
        // Ici, vous implémenteriez la mise à jour du mot de passe via une API
        toast.success("Mot de passe mis à jour avec succès");
        passwordForm.reset();
    };

    // Application immédiate des changements de paramètres du blog
    const handleBlogSettingChange = (setting: keyof BlogSettingsFormValues, value: boolean) => {
        // Ici, vous implémenteriez la mise à jour des paramètres via une API
        blogSettingsForm.setValue(setting, value);
        toast.success(`Paramètre mis à jour`);
    };

    return (
        <RouteGuard requireAuth={true}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Paramètres</h1>
                    <p className="text-zinc-400 mt-1">Gérez les paramètres de votre compte et du blog</p>
                </div>

                <Accordion type="multiple" defaultValue={[]} className="space-y-5">
                    {/* Section Profil */}
                    <AccordionItem value="profile" className="border border-zinc-800 rounded-md bg-zinc-900">
                        <AccordionTrigger className="px-5 py-4 hover:bg-zinc-800/50">
                            <div className="flex items-center">
                                <Settings className="mr-2 h-5 w-5" />
                                <span>Profil</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-5 pt-2">
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                                    <FormField
                                        control={profileForm.control}
                                        name="avatar"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-6">
                                                <Avatar className="size-24">
                                                    <AvatarImage src={field.value || undefined} />
                                                    <AvatarFallback className="bg-zinc-800 text-xl">
                                                        {profileForm.getValues("name").split(" ").map(n => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border-zinc-700"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <Upload size={16} className="mr-2" />
                                                        Changer d'avatar
                                                    </Button>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleAvatarUpload}
                                                    />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <Separator className="bg-zinc-800" />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={profileForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-zinc-300">Nom complet</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="bg-zinc-800 border-zinc-700 text-zinc-200 focus-visible:ring-zinc-600"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-zinc-300">E-mail</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            {...field}
                                                            className="bg-zinc-800 border-zinc-700 text-zinc-200 focus-visible:ring-zinc-600"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                                    >
                                        <Save size={16} className="mr-2" />
                                        Sauvegarder
                                    </Button>
                                </form>
                            </Form>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Section Mot de Passe */}
                    <AccordionItem value="password" className="border border-zinc-800 rounded-md bg-zinc-900">
                        <AccordionTrigger className="px-5 py-4 hover:bg-zinc-800/50">
                            <div className="flex items-center">
                                <KeyRound className="mr-2 h-5 w-5" />
                                <span>Mot de passe</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 pb-5 pt-2">
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                    <FormField
                                        control={passwordForm.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-300">Mot de passe actuel</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        className="bg-zinc-800 border-zinc-700 text-zinc-200 focus-visible:ring-zinc-600"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-300">Nouveau mot de passe</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        className="bg-zinc-800 border-zinc-700 text-zinc-200 focus-visible:ring-zinc-600"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-zinc-300">Confirmer le nouveau mot de passe</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        className="bg-zinc-800 border-zinc-700 text-zinc-200 focus-visible:ring-zinc-600"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="mt-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                                    >
                                        Modifier le mot de passe
                                    </Button>
                                </form>
                            </Form>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Section Notifications - visible pour les administrateurs et les éditeurs */}
                    {(user?.role === "admin" || user?.role === "editor") && (
                        <AccordionItem value="notifications" className="border border-zinc-800 rounded-md bg-zinc-900">
                            <AccordionTrigger className="px-5 py-4 hover:bg-zinc-800/50">
                                <div className="flex items-center">
                                    <Bell className="mr-2 h-5 w-5" />
                                    <span>Notifications</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-2">
                                <div className="space-y-4">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="flex items-center justify-between rounded-lg border border-zinc-800 p-4 hover:bg-zinc-800/40"
                                        >
                                            <div>
                                                <p className="font-medium text-zinc-200">{notification.name}</p>
                                                <p className="text-sm text-zinc-400">{notification.description}</p>
                                            </div>
                                            <Switch
                                                checked={notification.enabled}
                                                onCheckedChange={() => toggleNotification(notification.id)}
                                                className="bg-zinc-700 data-[state=checked]:bg-zinc-100 [&>span]:bg-white [&>span]:border-none data-[state=checked]:[&>span]:bg-zinc-800"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}

                    {/* Section Paramètres du Blog - visible pour les administrateurs et les éditeurs */}
                    {(user?.role === "admin" || user?.role === "editor") && (
                        <AccordionItem value="blog-settings" className="border border-zinc-800 rounded-md bg-zinc-900">
                            <AccordionTrigger className="px-5 py-4 hover:bg-zinc-800/50">
                                <div className="flex items-center">
                                    <Settings className="mr-2 h-5 w-5" />
                                    <span>Paramètres du blog</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-2">
                                <Form {...blogSettingsForm}>
                                    <form className="space-y-4">
                                        {/* Les champs "Nom du blog" et "Articles par page" ont été supprimés */}
                                        <FormField
                                            control={blogSettingsForm.control}
                                            name="enableComments"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between rounded-lg border border-zinc-800 p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-zinc-200">Activer les commentaires</FormLabel>
                                                        <FormDescription className="text-zinc-400">
                                                            Permettre aux visiteurs de commenter les articles
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={(checked: boolean) => {
                                                                field.onChange(checked);
                                                                handleBlogSettingChange('enableComments', checked);
                                                            }}
                                                            className="bg-zinc-700 data-[state=checked]:bg-zinc-100 [&>span]:bg-white [&>span]:border-none data-[state=checked]:[&>span]:bg-zinc-800"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={blogSettingsForm.control}
                                            name="requireModeration"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between rounded-lg border border-zinc-800 p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-zinc-200">Modération des commentaires</FormLabel>
                                                        <FormDescription className="text-zinc-400">
                                                            Approuver les commentaires avant publication
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={(checked: boolean) => {
                                                                field.onChange(checked);
                                                                handleBlogSettingChange('requireModeration', checked);
                                                            }}
                                                            className="bg-zinc-700 data-[state=checked]:bg-zinc-100 [&>span]:bg-white [&>span]:border-none data-[state=checked]:[&>span]:bg-zinc-800"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        {/* Le bouton de sauvegarde a été supprimé car les changements sont appliqués immédiatement */}
                                    </form>
                                </Form>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </div>
        </RouteGuard>
    );
}
