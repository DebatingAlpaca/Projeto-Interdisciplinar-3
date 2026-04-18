package com.example.alinhamais.managers;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.content.Intent;
import android.provider.Settings;

import com.example.alinhamais.models.LembreteResponse;
import com.example.alinhamais.receivers.LembreteAlarmReceiver;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class LembreteNotificationManager {




    // Agenda todos os alarmes de um lembrete
    public static void agendar(Context context, LembreteResponse lembrete) {
        cancelar(context, lembrete.getIdLembrete()); // Cancela anteriores antes

        List<int[]> horarios = calcularHorarios(
                lembrete.getHorarioInicio(),
                lembrete.getHorarioFim(),
                lembrete.getIntervaloMinutos()
        );

        AlarmManager alarmManager =
                (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (!alarmManager.canScheduleExactAlarms()) {
                Intent intent = new Intent(android.provider.Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
                return;
            }
        }

        for (int i = 0; i < horarios.size(); i++) {
            int hora   = horarios.get(i)[0];
            int minuto = horarios.get(i)[1];

            // Monta o Intent com os dados da notificação
            Intent intent = new Intent(context, LembreteAlarmReceiver.class);
            intent.putExtra(LembreteAlarmReceiver.EXTRA_TITULO,    lembrete.getTitulo());
            intent.putExtra(LembreteAlarmReceiver.EXTRA_DESCRICAO, lembrete.getDescricao());
            intent.putExtra(LembreteAlarmReceiver.EXTRA_ID,        lembrete.getIdLembrete());

            // Cada horário tem um requestCode único
            int requestCode = lembrete.getIdLembrete() * 1000 + i;

            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                    context,
                    requestCode,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            // Calcula quando é o próximo disparo desse horário
            Calendar calendario = Calendar.getInstance();
            calendario.set(Calendar.HOUR_OF_DAY, hora);
            calendario.set(Calendar.MINUTE, minuto);
            calendario.set(Calendar.SECOND, 0);
            calendario.set(Calendar.MILLISECOND, 0);

            // Se já passou hoje, agenda para amanhã
            if (calendario.getTimeInMillis() <= System.currentTimeMillis()) {
                calendario.add(Calendar.DAY_OF_YEAR, 1);
            }

            // Agenda para repetir todo dia no mesmo horário
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        calendario.getTimeInMillis(),
                        pendingIntent
                );
            } else {
                alarmManager.setExact(
                        AlarmManager.RTC_WAKEUP,
                        calendario.getTimeInMillis(),
                        pendingIntent
                );
            }
        }
    }

    // Cancela todos os alarmes de um lembrete
    public static void cancelar(Context context, int idLembrete) {
        AlarmManager alarmManager =
                (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        // Cancela até 100 horários possíveis por lembrete
        for (int i = 0; i < 100; i++) {
            Intent intent = new Intent(context, LembreteAlarmReceiver.class);
            int requestCode = idLembrete * 1000 + i;

            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                    context,
                    requestCode,
                    intent,
                    PendingIntent.FLAG_NO_CREATE | PendingIntent.FLAG_IMMUTABLE
            );

            if (pendingIntent != null) {
                alarmManager.cancel(pendingIntent);
                pendingIntent.cancel();
            }
        }
    }

    // Cancela todos os lembretes
    public static void cancelarTodos(Context context, List<LembreteResponse> lembretes) {
        for (LembreteResponse l : lembretes) {
            cancelar(context, l.getIdLembrete());
        }
    }

    // Calcula todos os horários entre início e fim com o intervalo
    // Ex: 07:00 às 22:00 com 60min → [07:00, 08:00, 09:00... 22:00]
    public static List<int[]> calcularHorarios(String inicio, String fim, int intervaloMinutos) {
        List<int[]> horarios = new ArrayList<>();

        if (inicio == null || fim == null || intervaloMinutos <= 0) return horarios;

        try {
            String[] partsInicio = inicio.split(":");
            String[] partsFim    = fim.split(":");

            int inicioMin = Integer.parseInt(partsInicio[0]) * 60
                    + Integer.parseInt(partsInicio[1]);
            int fimMin    = Integer.parseInt(partsFim[0]) * 60
                    + Integer.parseInt(partsFim[1]);

            for (int min = inicioMin; min <= fimMin; min += intervaloMinutos) {
                horarios.add(new int[]{ min / 60, min % 60 });
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return horarios;
    }
}