package com.example.alinhamais;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.alinhamais.adapters.NotificacaoAdapter;
import com.example.alinhamais.api.RetrofitClient;
import com.example.alinhamais.api.ApiService;
import com.example.alinhamais.models.NotificacaoResponse;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class NotificacoesFragment extends Fragment {

    private RecyclerView recyclerView;
    private NotificacaoAdapter adapter;
    private List<NotificacaoResponse> lista = new ArrayList<>();
    private ApiService api;

    private int idPaciente;

    public NotificacoesFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_notificacoes, container, false);

        recyclerView = view.findViewById(R.id.recyclerNotificacoes);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        api = RetrofitClient.getApiService(requireContext());

        SharedPreferences prefs = getContext().getSharedPreferences("MayaPrefs", Context.MODE_PRIVATE);
        idPaciente = prefs.getInt("id_usuario", 0);
        Log.d("DEBUG", "ID: " + idPaciente);

        adapter = new NotificacaoAdapter(new ArrayList<>(), notificacao -> {
            marcarComoLida(notificacao.getId_notificacao());
        });

        recyclerView.setAdapter(adapter);

        carregarNotificacoes();

        return view;
    }

    private void carregarNotificacoes() {
        Call<List<NotificacaoResponse>> call = api.getNotificacoes(idPaciente);

        call.enqueue(new Callback<List<NotificacaoResponse>>() {
            @Override
            public void onResponse(Call<List<NotificacaoResponse>> call, Response<List<NotificacaoResponse>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Log.d("API", "Resposta: " + response.body());
                    Log.d("API", "Quantidade: " + (response.body() != null ? response.body().size() : 0));
                    adapter.setLista(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<NotificacaoResponse>> call, Throwable t) {
                t.printStackTrace();
            }
        });
    }

    private void marcarComoLida(int idNotificacao) {
        api.marcarComoLida(idNotificacao).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                carregarNotificacoes(); // atualiza lista
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                t.printStackTrace();
            }
        });
    }
}