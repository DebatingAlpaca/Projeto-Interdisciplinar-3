package com.example.alinhamais;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ContatosFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ContatosFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public ContatosFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Contatos.
     */
    // TODO: Rename and change types and number of parameters
    public static ContatosFragment newInstance(String param1, String param2) {
        ContatosFragment fragment = new ContatosFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View rootView = inflater.inflate(R.layout.fragment_contatos, container, false);

        Button emailBtn = rootView.findViewById(R.id.emailBtn);
        Button whatsappBtn = rootView.findViewById(R.id.whatsappBtn);

        whatsappBtn.setOnClickListener(v -> goToLink("https://wa.me/11947294719"));

        emailBtn.setOnClickListener(v -> sendEmail());

        return(rootView);
    }

    //Pega uma string(link) e manda para esse link
    private void goToLink(String url){
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
    }

    private void sendEmail() {
        Intent intent = new Intent(Intent.ACTION_SENDTO);
        intent.setData(Uri.parse("mailto:stefanysoliveirac@gmail.com")); // Only email apps should handle this
        intent.putExtra(Intent.EXTRA_SUBJECT, "Dúvida sobre o App");
        intent.putExtra(Intent.EXTRA_TEXT, "Olá, vim pelo aplicativo Alinha+, gostaria de falar sobre...");

        try {
            startActivity(Intent.createChooser(intent, "Enviar e-mail com..."));
        } catch (android.content.ActivityNotFoundException ex) {
            // Caso não haja app de email
            Toast.makeText(getActivity(), "Não há aplicativos de e-mail instalados.", Toast.LENGTH_SHORT).show();
        }
    }
}