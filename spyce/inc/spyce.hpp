#pragma once

#include <boost/python.hpp>

#include "SpiceUsr.h"

struct Frame {
    double x,y,z,dx,dy,dz;

    Frame(SpiceDouble *frame);
    Frame();
};

namespace py = boost::python;
struct spyce {
    std::string file;

    spyce();
    spyce(std::string log_file);

    static int str_to_id(std::string naif_id);
    static std::string id_to_str(int naif_id);

    //get and set for file.
    void _set_file(std::string s);
    std::string _get_file();

    void add_kernel(std::string s);
    void remove_kernel(std::string s);

    py::list get_objects();
    py::list get_coverage_windows(int obj_id);

    Frame get_frame_data(int target_id, int observer_id, double e_time);
};